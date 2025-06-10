import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ProgramsSearchService } from "./services/programs-search.service";
import { DiscussionsSearchService } from "./services/discussions-search.service";
import { ProgramsSearchQueryDto } from "./dto/programs-search-query.dto";
import { DiscussionsSearchQueryDto } from "./dto/discussions-search-query.dto";
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";
import { User } from "src/modules/users/entities/user.entity";

@UseGuards(OptionalAuthGuard)
@Controller("search")
export class SearchController {
  constructor(
    private readonly programsSearchService: ProgramsSearchService,
    private readonly discussionsSearchService: DiscussionsSearchService,
  ) {}

  @Get("programs")
  searchPrograms(
    @CurrentUser({ optional: true }) user: User | null,
    @Query() query: ProgramsSearchQueryDto,
  ) {
    return this.programsSearchService.search(user?.id, query);
  }

  @Get("discussions")
  searchDiscussions(
    @CurrentUser() user: User | null,
    @Query() query: DiscussionsSearchQueryDto,
  ) {
    return this.discussionsSearchService.search(user?.id, query);
  }
}
