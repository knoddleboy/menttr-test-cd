import { Module } from "@nestjs/common";
import { ProgramIndexingController } from "./controllers/program-indexing.controller";
import { DiscussionIndexingController } from "./controllers/discussion-indexing.controller";
import { ProgramIndexingService } from "./services/program-indexing.service";
import { DiscussionIndexingService } from "./services/discussion-indexing.service";
import { RmqClientsModule } from "src/infra/rabbitmq/rabbitmq.module";
import { ElasticsearchModule } from "src/infra/elasticsearch/elasticsearch.module";
import { UserIndexingController } from "./controllers/user-indexing.controller";
import { UserIndexingService } from "./services/user-indexing.service";

@Module({
  imports: [ElasticsearchModule, RmqClientsModule],
  controllers: [
    ProgramIndexingController,
    DiscussionIndexingController,
    UserIndexingController,
  ],
  providers: [
    ProgramIndexingService,
    DiscussionIndexingService,
    UserIndexingService,
  ],
})
export class IndexingModule {}
