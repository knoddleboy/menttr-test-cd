import { Module } from "@nestjs/common";
import { ProgramsSearchService } from "./services/programs-search.service";
import { DiscussionsSearchService } from "./services/discussions-search.service";
import { ElasticsearchModule } from "src/infra/elasticsearch/elasticsearch.module";
import { SearchController } from "./search.controller";
import { PostModule } from "src/modules/discussions/post/post.module";
import { ProgramModule } from "src/modules/programs/program/program.module";

@Module({
  imports: [ElasticsearchModule, ProgramModule, PostModule],
  providers: [ProgramsSearchService, DiscussionsSearchService],
  controllers: [SearchController],
})
export class SearchModule {}
