import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Program } from "../entities/program.entity";
import { ProgramStatus } from "../enums/program-status.enum";
import { ProgramReview } from "../entities/program-rating.entity";
import { CreateProgramReviewDto } from "./dto/create-program-review.dto";
import { UserService } from "src/modules/users/user/user.service";

@Injectable()
export class ProgramReviewService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(ProgramReview)
    private readonly reviewRepository: Repository<ProgramReview>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async getProgramReviews(programId: number) {
    const reviews = await this.reviewRepository.findBy({
      program: { id: programId },
    });

    const userIds = reviews.map((r) => r.userId);
    const users = await this.userService.findByIds(userIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    const enrichedReviews = reviews.map((r) => ({
      ...r,
      user: userMap.get(r.userId) || null,
    }));

    return {
      reviews: enrichedReviews,
    };
  }

  async getUserReviews(userId: number) {
    const reviews = await this.reviewRepository.find({
      where: { program: { ownerId: userId } },
      order: { createdAt: "desc" },
      relations: ["program"],
    });

    const userIds = reviews.map((r) => r.userId);
    const users = await this.userService.findByIds(userIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    const enrichedReviews = reviews.map((r) => ({
      ...r,
      user: userMap.get(r.userId) || null,
    }));

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? total / reviews.length : 0;

    return {
      reviews: enrichedReviews,
      averageRating,
    };
  }

  async createProgramReview(
    userId: number,
    programId: number,
    dto: CreateProgramReviewDto,
  ) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
      relations: ["participants"],
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (program.status !== ProgramStatus.Completed) {
      throw new ForbiddenException("You can only review completed programs.");
    }

    const isParticipant = program.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      throw new ForbiddenException(
        "Only users participated in this program can review it.",
      );
    }

    const review = this.reviewRepository.create({
      ...dto,
      program,
      userId,
    });

    await this.reviewRepository.save(review);

    return {
      message: "Your review has been submitted successfully.",
      data: review,
    };
  }
}
