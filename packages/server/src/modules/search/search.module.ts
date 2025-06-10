import { Module } from "@nestjs/common";
import { SearchModule } from "./search/search.module";
import { IndexingModule } from "./indexing/indexing.module";

@Module({
  imports: [IndexingModule, SearchModule],
})
export class SearchEngineModule {}
