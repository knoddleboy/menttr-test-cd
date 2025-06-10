import { Module } from "@nestjs/common";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { FeedModule } from "./feed/feed.module";

@Module({
  imports: [PostModule, CommentModule, FeedModule],
})
export class DiscussionModule {}
