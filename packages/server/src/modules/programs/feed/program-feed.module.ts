import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "src/infra/elasticsearch/elasticsearch.module";
import { ProgramFeedService } from "./program-feed.service";
import { ProgramFeedController } from "./program-feed.controller";
import { ProgramModule } from "../program/program.module";
import { AuthModule } from "src/modules/auth/auth.module";

@Module({
  imports: [ElasticsearchModule, ProgramModule, AuthModule],
  controllers: [ProgramFeedController],
  providers: [ProgramFeedService],
})
export class ProgramFeedModule {}
