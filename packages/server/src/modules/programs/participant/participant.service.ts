import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Program } from "../entities/program.entity";
import { ProgramStatus } from "../enums/program-status.enum";
import { UserService } from "src/modules/users/user/user.service";
import { Participant } from "../entities/participant.entity";
import { Status } from "src/shared/enums/status.enum";
import { CreateParticipantDto } from "./dto/create-participant.dto";
import { UpdateParticipantStatusDto } from "./dto/update-participant-status.dto";
import { ChatService } from "src/modules/chat/chat.service";

@Injectable()
export class ParticipantService {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async getParticipants(userId: number | undefined, programId: number) {
    const program = await this.programRepository
      .createQueryBuilder("program")
      .leftJoinAndSelect("program.participants", "participant")
      .where("program.id = :id", { id: programId })
      .orderBy("participant.createdAt", "DESC")
      .getOne();

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    const activeParticipantsRaw = program.participants.filter(
      (participant) => participant.status === Status.Accepted,
    );

    const activeParticipantUserIds = [
      ...new Set(
        activeParticipantsRaw.map((participant) => participant.userId),
      ),
    ];
    const activeParticipantUsers = await this.userService.findByIds(
      activeParticipantUserIds,
    );

    const activeParticipants = activeParticipantsRaw.map((program) => {
      const { userId, ...data } = program;
      return {
        ...data,
        user: activeParticipantUsers.find((user) => user.id === userId)!,
      };
    });

    const pendingParticipantsRaw = program.participants.filter(
      (participant) => participant.status === Status.Pending,
    );

    const pendingParticipantUserIds = [
      ...new Set(
        pendingParticipantsRaw.map((participant) => participant.userId),
      ),
    ];
    const pendingParticipantUsers = await this.userService.findByIds(
      pendingParticipantUserIds,
    );

    const pendingParticipants = pendingParticipantsRaw.map((program) => {
      const { userId, ...data } = program;
      return {
        ...data,
        user: pendingParticipantUsers.find((user) => user.id === userId)!,
      };
    });

    const programOwner = await this.userService.findById(program.ownerId);

    const isUserOwner = programOwner?.id === userId;
    const isUserParticipant = activeParticipants.some(
      (participant) => participant.user.id === userId,
    );

    if (isUserOwner) {
      return {
        active: activeParticipants,
        activeCount: activeParticipants.length,
        pending: pendingParticipants,
        pendingCount: pendingParticipants.length,
      };
    }

    if (isUserParticipant) {
      return {
        active: activeParticipants,
        activeCount: activeParticipants.length,
      };
    }

    return {
      activeCount: activeParticipants.length,
    };
  }

  async getParticipant(userId: number, programId: number) {
    return this.participantRepository.findOne({
      where: {
        userId,
        program: { id: programId },
      },
    });

    // if (!participant) {
    //   return null;
    // }

    // const user = await this.userService.findById(participant.userId);

    // if (!user) {
    //   throw new NotFoundException("Participant not found.");
    // }

    // const publicProfile = await this.userService.getPublicProfile(
    //   user.username,
    // );

    // const { userId: _, ...participantData } = participant;

    // return {
    //   ...participantData,
    //   user: publicProfile,
    // };
  }

  async createParticipant(
    userId: number,
    programId: number,
    dto: CreateParticipantDto,
  ) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (userId === program.ownerId) {
      throw new ForbiddenException("You cannot apply for this program.");
    }

    if (program.activeParticipants >= program.maxParticipants) {
      throw new ConflictException(
        "You cannot apply for this program because it has reached the maximum number of participants.",
      );
    }

    const existingParticipant = await this.getParticipant(userId, programId);

    switch (existingParticipant?.status) {
      case Status.Pending:
        throw new ConflictException(
          "You have already applied for this program. Please wait for your mentor to review your application.",
        );
      case Status.Accepted:
        throw new BadRequestException(
          "You are already accepted for this program.",
        );
      case Status.Rejected:
        throw new ForbiddenException(
          "Your application for this program was rejected. You cannot apply again at this time.",
        );
    }

    const newParticipant = this.participantRepository.create({
      userId,
      program: { id: programId },
      motivation: dto.motivation,
    });

    // TODO: send notification to the mentor

    const saved = await this.participantRepository.save(newParticipant);

    return {
      message:
        "Your application has been successfully submitted. Please wait while your mentor reviews it. You'll be notified once a decision is made.",
      participant: saved,
    };
  }

  async updateParticipantStatus(
    userId: number,
    participantId: number,
    dto: UpdateParticipantStatusDto,
  ) {
    const { status, reason } = dto;

    const participant = await this.participantRepository.findOne({
      where: { id: participantId },
      relations: ["program"],
    });

    if (!participant) {
      throw new NotFoundException("Participant not found.");
    }

    const program = participant.program;

    if (userId !== program.ownerId) {
      throw new ForbiddenException(
        "You cannot accept participants for this program.",
      );
    }

    if (program.status !== ProgramStatus.Enrollment) {
      throw new BadRequestException(
        "You cannot accept participants after the enrollment period has ended.",
      );
    }

    if (status === Status.Accepted) {
      if (program.activeParticipants >= program.maxParticipants) {
        throw new ConflictException(
          "Cannot accept new participant because the program is full.",
        );
      }

      participant.enrolledAt = new Date();

      await this.programRepository.increment(
        { id: program.id },
        "activeParticipants",
        1,
      );

      await this.chatService.createParticipant(
        program.chatId,
        participant.userId,
      );

      // TODO: send notification to this participant about approval

      // Reject remaining applications
      if (program.activeParticipants >= program.maxParticipants) {
        await this.participantRepository.update(
          {
            program,
            status: Status.Pending,
          },
          { status: Status.Rejected, rejectedAt: new Date() },
        );

        // TODO: send notifications to all remaining applications about rejection
      }
    } else if (status === Status.Rejected) {
      participant.rejectedAt = new Date();
      if (reason) {
        participant.rejectionReason = reason;
      }

      // TODO: send notification to this participant about rejection
      // Maybe store rejection info (no column yet)
    }

    participant.status = status;
    await this.participantRepository.save(participant);

    return { message: "Application accepted. " };
  }
}
