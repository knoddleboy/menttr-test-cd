import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/modules/auth/auth.module";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { MentorApplication } from "../entities/mentor-application.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorApplication]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
