import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { Post } from "../entities/post.entity";
import { AuthModule } from "src/modules/auth/auth.module";
import { RmqClientsModule } from "src/infra/rabbitmq/rabbitmq.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => AuthModule),
    RmqClientsModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
