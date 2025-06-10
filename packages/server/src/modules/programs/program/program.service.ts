import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import { INDEXING_SERVICE } from "src/infra/rabbitmq/rabbitmq.constants";
import { ClientProxy } from "@nestjs/microservices";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { Program } from "../entities/program.entity";
import { ProgramStatus } from "../enums/program-status.enum";
import { Skill } from "src/shared/entities/skill.entity";
import { UserService } from "src/modules/users/user/user.service";
import { Status } from "src/shared/enums/status.enum";
import { Participant } from "../entities/participant.entity";
import { ChatService } from "src/modules/chat/chat.service";

@Injectable()
export class ProgramService {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @Inject(INDEXING_SERVICE)
    private readonly indexingServiceRmqClient: ClientProxy,
  ) {}

  async findById(id: number) {
    const program = await this.programRepository.findOne({
      where: { id },
      relations: ["skills"],
    });

    if (!program) {
      return null;
    }

    const owner = await this.userService.findById(program?.ownerId);

    const { ownerId, ...programData } = program;

    return {
      ...programData,
      owner,
    };
  }

  async findByIds(ids: number[]) {
    const programs = await this.programRepository.find({
      where: { id: In(ids) },
      relations: ["skills"],
    });

    if (!programs.length) {
      return [];
    }

    const ownerIds = [...new Set(programs.map((program) => program.ownerId))];
    const owners = await this.userService.findByIds(ownerIds);

    return programs.map((program) => {
      const { ownerId, ...data } = program;
      return {
        ...data,
        owner: owners.find((owner) => owner.id === ownerId),
      };
    });
  }

  async getOwnPrograms(userId: number) {
    const [activePrograms, activeCount] =
      await this.programRepository.findAndCount({
        where: {
          ownerId: userId,
          status: Not(ProgramStatus.Completed),
        },
        relations: ["skills"],
        order: { updatedAt: "desc" },
      });

    const [archivedPrograms, archivedCount] =
      await this.programRepository.findAndCount({
        where: {
          ownerId: userId,
          status: ProgramStatus.Completed,
        },
        relations: ["skills"],
        order: { updatedAt: "desc" },
      });

    return {
      active: {
        items: activePrograms,
        count: activeCount,
      },
      archived: {
        items: archivedPrograms,
        count: archivedCount,
      },
    };
  }

  async getJoinedPrograms(userId: number) {
    const [activePrograms, activeCount] =
      await this.programRepository.findAndCount({
        where: {
          participants: {
            userId,
            status: Status.Accepted,
          },
          status: Not(ProgramStatus.Completed),
        },
        relations: ["skills"],
        order: { participants: { createdAt: "desc" } },
      });

    const [pendingPrograms, pendingCount] =
      await this.programRepository.findAndCount({
        where: {
          participants: {
            userId,
            status: Status.Pending,
          },
          status: Not(ProgramStatus.Completed),
        },
        relations: ["skills"],
        order: { participants: { createdAt: "desc" } },
      });

    const [archivedPrograms, archivedCount] =
      await this.programRepository.findAndCount({
        where: {
          participants: {
            userId,
            status: Status.Accepted,
          },
          status: ProgramStatus.Completed,
        },
        relations: ["skills"],
        order: { updatedAt: "desc" },
      });

    return {
      active: {
        items: activePrograms,
        count: activeCount,
      },
      pending: {
        items: pendingPrograms,
        count: pendingCount,
      },
      archived: {
        items: archivedPrograms,
        count: archivedCount,
      },
    };
  }

  async createProgram(userId: number, dto: CreateProgramDto) {
    if (dto.endDate && dto.startDate >= dto.endDate) {
      throw new BadRequestException("End date cannot be before start date.");
    }

    const { skillIds, ...rest } = dto;

    const program = this.programRepository.create({
      ...rest,
      ownerId: userId,
      status: ProgramStatus.Enrollment,
    });

    if (skillIds) {
      const skills = await this.skillRepository.find({
        where: { id: In(skillIds) },
      });
      program.skills = skills;
    }

    try {
      const programChat = await this.chatService.createConversation(userId, {
        title: dto.title,
        userIds: [],
      });
      program.chatId = programChat.id;

      const saved = await this.programRepository.save(program);

      this.indexingServiceRmqClient.emit("program.created", {
        id: saved.id,
        title: saved.title,
        description: saved.description || "",
        type: saved.type.toString(),
        startDate: saved.startDate.toISOString(),
        endDate: saved.endDate?.toISOString() || null,
        maxParticipants: saved.maxParticipants,
        enrollmentFillRate: 0,
        skills: saved.skills.map((x) => x.name),
        createdAt: saved.createdAt.toISOString(),
      });

      return this.findById(saved.id);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async updateProgram(
    userId: number,
    programId: number,
    dto: UpdateProgramDto,
  ) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
      relations: ["skills", "participants"],
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (program.ownerId !== userId) {
      throw new ForbiddenException("You cannot update this program.");
    }

    if (program.status === ProgramStatus.Completed) {
      throw new BadRequestException(
        "Cannot update completed/archived program.",
      );
    }

    const {
      title,
      description,
      type,
      startDate,
      endDate,
      maxParticipants,
      status,
      skillIds,
    } = dto;

    if (
      program.status !== ProgramStatus.Enrollment &&
      (title || description || type || startDate || maxParticipants || skillIds)
    ) {
      throw new BadRequestException(
        "Cannot update some values after enrollment period is finished.",
      );
    }

    if (
      program.status !== ProgramStatus.Enrollment &&
      status === ProgramStatus.Enrollment
    ) {
      throw new BadRequestException(
        "Cannot revert status back to 'Enrollment'.",
      );
    }

    if (
      startDate &&
      program.endDate &&
      startDate > (endDate ?? program.endDate)
    ) {
      throw new BadRequestException("Start date cannot be after end date.");
    }

    if (endDate && endDate < (startDate ?? program.startDate)) {
      throw new BadRequestException("End date cannot be before start date.");
    }

    program.title = title ?? program.title;
    program.description = description ?? program.description;
    program.type = type ?? program.type;
    program.maxParticipants = maxParticipants ?? program.maxParticipants;
    program.startDate = startDate ?? program.startDate;
    program.endDate = endDate ?? program.endDate;
    program.status = status ?? program.status;

    if (skillIds) {
      const skills = await this.skillRepository.find({
        where: { id: In(skillIds) },
      });
      program.skills = skills;
    }

    try {
      // If program status changed from enrollment, delete program from search index
      if (
        program.status === ProgramStatus.Enrollment &&
        status !== ProgramStatus.Enrollment
      ) {
        this.indexingServiceRmqClient.emit("program.enrollment.closed", {
          id: programId,
        });

        // TODO: fix
        await this.participantRepository.delete({
          program: { id: programId },
          status: Status.Pending,
        });
      }

      const saved = await this.programRepository.save(program);

      const enrollmentFillRate =
        saved.activeParticipants / saved.maxParticipants;

      this.indexingServiceRmqClient.emit("program.updated", {
        id: saved.id,
        title: saved.title,
        description: saved.description || "",
        type: saved.type.toString(),
        startDate: saved.startDate.toISOString(),
        endDate: saved.endDate?.toISOString() || [],
        maxParticipants: saved.maxParticipants,
        enrollmentFillRate: Math.min(enrollmentFillRate, 1),
        skills: saved.skills.map((x) => x.name),
        createdAt: saved.createdAt.toISOString(),
      });

      return this.findById(saved.id);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async archiveProgram(userId: number, programId: number) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
      relations: ["participants"],
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (program.ownerId !== userId) {
      throw new ForbiddenException("You cannot archive this program.");
    }

    if (program.status === ProgramStatus.Completed) {
      throw new BadRequestException("Program is already archived.");
    }

    for (const participant of program.participants) {
      if (participant.status === Status.Pending) {
        await this.participantRepository.delete(participant.id);
        // TODO: send notification about deletion
      }
      // TODO: send notification about archivation
    }

    try {
      await this.programRepository.update(
        { id: programId },
        { status: ProgramStatus.Completed },
      );

      this.indexingServiceRmqClient.emit("program.archived", {
        id: programId,
      });

      return {
        data: { id: programId },
        message: "Program successfully archived.",
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteProgram(userId: number, programId: number) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
      relations: ["participants"],
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (program.ownerId !== userId) {
      throw new ForbiddenException("You cannot update this program.");
    }

    if (program.activeParticipants > 0) {
      throw new ForbiddenException(
        "You can only archive this program as it has active participants.",
      );
    }

    if (program.status === ProgramStatus.Completed) {
      throw new ForbiddenException("Cannot delete archived program.");
    }

    for (const participant of program.participants) {
      if (participant.status === Status.Pending) {
        await this.participantRepository.delete(participant.id);
        // TODO: send notification
      }
    }

    try {
      await this.programRepository.delete({
        id: programId,
        ownerId: userId,
      });

      this.indexingServiceRmqClient.emit("program.deleted", {
        id: programId,
      });

      return {
        data: { id: programId },
        message: "Program successfully deleted.",
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
