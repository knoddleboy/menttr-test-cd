import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgramSession } from "../entities/program-session";
import { SessionParticipant } from "../entities/session-participant";
import { ZoomService } from "./zoom/zoom.service";
import { ZoomAuthService } from "./zoom/zoom-auth.service";
import { Participant } from "../entities/participant.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramSession, SessionParticipant, Participant]),
    HttpModule,
    JwtModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, ZoomService, ZoomAuthService],
})
export class SessionModule {}
