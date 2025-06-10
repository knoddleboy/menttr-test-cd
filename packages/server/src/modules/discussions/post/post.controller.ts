import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { User } from "src/modules/users/entities/user.entity";
import { GetPostsDto } from "./dto/get-posts.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts(@Query() query: GetPostsDto) {
    return this.postService.getPosts(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@CurrentUser() user: User, @Body() dto: CreatePostDto) {
    return this.postService.createPost(user.id, dto);
  }
}
