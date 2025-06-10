import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { User } from "src/modules/users/entities/user.entity";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("posts/:postId/comments")
  getComments(@Param("postId", ParseIntPipe) postId: number) {
    return this.commentService.getComments(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("posts/:postId/comments")
  createComment(
    @CurrentUser() user: User,
    @Param("postId", ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createComment(user.id, postId, dto);
  }

  @Get("comments/:commentId/replies")
  getReplies(@Param("commentId", ParseIntPipe) commentId: number) {
    return this.commentService.getReplies(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("comments/:commentId/replies")
  createReply(
    @CurrentUser() user: User,
    @Param("commentId", ParseIntPipe) commentId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createReply(user.id, commentId, dto);
  }
}
