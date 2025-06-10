import { Controller, Get, Query } from "@nestjs/common";
import { FeedQueryDto } from "./dtos/feed-query.dto";
import { FeedService } from "./feed.service";

@Controller("dicsussions/feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getDiscussionFeed(@Query() query: FeedQueryDto) {
    return this.feedService.getDiscussionFeed(query);
  }
}
