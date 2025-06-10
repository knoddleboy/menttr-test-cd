import { Module } from "@nestjs/common";
import { ProgramReviewController } from "./program-review.controller";
import { ProgramReviewService } from "./program-review.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Program } from "../entities/program.entity";
import { ProgramReview } from "../entities/program-rating.entity";
import { UsersModule } from "src/modules/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Program, ProgramReview]), UsersModule],
  controllers: [ProgramReviewController],
  providers: [ProgramReviewService],
})
export class ProgramReviewModule {}
