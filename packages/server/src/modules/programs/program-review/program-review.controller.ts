import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { User } from "src/modules/users/entities/user.entity";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";
import { ProgramReviewService } from "./program-review.service";
import { CreateProgramReviewDto } from "./dto/create-program-review.dto";

@Controller()
export class ProgramReviewController {
  constructor(private readonly reviewService: ProgramReviewService) {}

  @Get("reviews/by-program/:programId")
  getProgramReviews(@Param("programId", ParseIntPipe) programId: number) {
    return this.reviewService.getProgramReviews(programId);
  }

  @Get("reviews/by-user/:userId")
  getUserReviews(@Param("userId", ParseIntPipe) userId: number) {
    return this.reviewService.getUserReviews(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("programs/:programId/reviews")
  createProgramReview(
    @CurrentUser() user: User,
    @Param("programId", ParseIntPipe) programId: number,
    @Body() dto: CreateProgramReviewDto,
  ) {
    return this.reviewService.createProgramReview(user.id, programId, dto);
  }
}
