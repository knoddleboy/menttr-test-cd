import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "src/infra/elasticsearch/elasticsearch.module";
import { FeedService } from "./feed.service";
import { FeedController } from "./feed.controller";

@Module({
  imports: [ElasticsearchModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
