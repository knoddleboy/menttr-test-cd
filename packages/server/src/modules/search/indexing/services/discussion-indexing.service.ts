import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { IndexingService } from "../indexing.service";
import { DISCUSSIONS_INDEX } from "../../search.constants";

@Injectable()
export class DiscussionIndexingService extends IndexingService {
  protected indexName = DISCUSSIONS_INDEX;

  constructor(es: ElasticsearchService) {
    super(es);
  }

  protected async initIndices() {
    await this.ensureIndex({
      mappings: {
        properties: {
          id: { type: "keyword" },
          type: { type: "keyword" },
          title: { type: "text" },
          content: { type: "text" },
          postId: { type: "keyword" },
          // upvotesCount: { type: "integer" },
          // commentsCount: { type: "integer" },
          createdAt: { type: "date" },
        },
      },
    });
  }
}
