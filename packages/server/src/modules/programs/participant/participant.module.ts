import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/modules/auth/auth.module";
import { Program } from "../entities/program.entity";
import { UsersModule } from "src/modules/users/users.module";
import { Participant } from "../entities/participant.entity";
import { ParticipantController } from "./participant.controller";
import { ParticipantService } from "./participant.service";
import { ChatModule } from "src/modules/chat/chat.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, Participant]),
    AuthModule,
    UsersModule,
    ChatModule,
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
