import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Skill } from "src/shared/entities/skill.entity";
import { MentorApplication } from "../entities/mentor-application.entity";
import { RmqClientsModule } from "src/infra/rabbitmq/rabbitmq.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { SearchEngineModule } from "src/modules/search/search.module";
import { SecretModule } from "../secret/secret.module";
import { UserLocation } from "../entities/user-location.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Skill, UserLocation, MentorApplication]),
    RmqClientsModule,
    forwardRef(() => AuthModule),
    SecretModule,
    SearchEngineModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
