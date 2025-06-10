import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "src/shared/enums/role.enum";
import { MentorApplication } from "../entities/mentor-application.entity";
import { UserService } from "../user/user.service";
import { UpdateApplicationStatusDto } from "../dto/update-application-status.dto";
import { Status } from "src/shared/enums/status.enum";

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(MentorApplication)
    private readonly mentorApplicationRepository: Repository<MentorApplication>,
  ) {}

  async getApplications() {
    return this.mentorApplicationRepository.find({
      relations: ["user"],
      order: { createdAt: "desc" },
    });
  }

  async updateApplicationStatus(id: number, dto: UpdateApplicationStatusDto) {
    const application = await this.mentorApplicationRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!application) {
      throw new NotFoundException("Mentor application not found.");
    }

    await this.mentorApplicationRepository.update(id, {
      status: dto.status,
      reason: dto.reason,
    });

    // Send reason to applicant

    if (dto.status === Status.Accepted) {
      await this.userService.updateRole(application.user.id, Role.Mentor);
      return {
        message:
          "Mentee application has been accepted. The applicant will be notified.",
      };
    }

    if (dto.status === Status.Rejected) {
      return {
        message:
          "Mentee application has been rejected. The applicant will be informed of your decision.",
      };
    }
  }
}
