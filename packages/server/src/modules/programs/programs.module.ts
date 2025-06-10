import { Module } from "@nestjs/common";
import { ProgramModule } from "./program/program.module";
import { ParticipantModule } from "./participant/participant.module";
import { ProgramFeedModule } from "./feed/program-feed.module";
import { ProgramReviewModule } from "./program-review/program-review.module";
import { SessionModule } from "./session/session.module";

@Module({
  imports: [
    ProgramModule,
    ParticipantModule,
    ProgramFeedModule,
    ProgramReviewModule,
    SessionModule,
  ],
  exports: [ProgramModule],
})
export class ProgramsModule {}
