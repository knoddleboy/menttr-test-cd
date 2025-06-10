import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { Post } from "../entities/post.entity";
import { Comment } from "../entities/comment.entity";
import { AuthModule } from "src/modules/auth/auth.module";
import { RmqClientsModule } from "src/infra/rabbitmq/rabbitmq.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    AuthModule,
    RmqClientsModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
