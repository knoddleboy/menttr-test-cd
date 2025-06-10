import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";
import { User } from "src/modules/users/entities/user.entity";
import { ProgramFeedQueryDto } from "./dto/program-feed-query.dto";
import { ProgramFeedService } from "./program-feed.service";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";

@Controller("feed/programs")
export class ProgramFeedController {
  constructor(private readonly programFeedService: ProgramFeedService) {}

  @UseGuards(OptionalAuthGuard)
  @Get()
  getProgramFeed(
    @CurrentUser({ optional: true }) user: User | null,
    @Query() query: ProgramFeedQueryDto,
  ) {
    return this.programFeedService.getProgramFeed(user?.id ?? null, query);
  }
}
