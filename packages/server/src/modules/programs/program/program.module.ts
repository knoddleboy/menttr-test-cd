import { forwardRef, Module } from "@nestjs/common";
import { ProgramController } from "./program.controller";
import { ProgramService } from "./program.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RmqClientsModule } from "src/infra/rabbitmq/rabbitmq.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { UsersModule } from "src/modules/users/users.module";
import { Program } from "../entities/program.entity";
import { Participant } from "../entities/participant.entity";
import { Skill } from "src/shared/entities/skill.entity";
import { ChatModule } from "src/modules/chat/chat.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, Participant, Skill]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    ChatModule,
    RmqClientsModule,
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [TypeOrmModule, ProgramService],
})
export class ProgramModule {}
