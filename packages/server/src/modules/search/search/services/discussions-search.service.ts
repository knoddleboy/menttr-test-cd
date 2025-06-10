import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { DiscussionsSearchQueryDto } from "../dto/discussions-search-query.dto";
import { PostService } from "src/modules/discussions/post/post.service";
import { DISCUSSIONS_INDEX, DEFAULT_PAGE_SIZE } from "../../search.constants";

@Injectable()
export class DiscussionsSearchService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly postService: PostService,
  ) {}

  async search(userId: number | undefined, dto: DiscussionsSearchQueryDto) {
    const { query, cursor } = dto;

    const esResult = await this.es.search<{ postId: number }>({
      index: DISCUSSIONS_INDEX,
      size: DEFAULT_PAGE_SIZE,
      query: {
        function_score: {
          query: {
            multi_match: {
              query,
              fields: ["title^3", "content"],
              fuzziness: "AUTO",
            },
          },
          functions: [
            {
              filter: { term: { type: "post" } },
              weight: 1,
            },
            {
              gauss: {
                createdAt: {
                  origin: "now",
                  scale: "2d",
                  decay: 0.5,
                },
              },
              weight: 1.5,
            },
          ],
          score_mode: "sum",
          boost_mode: "sum",
        },
      },
      sort: [
        { _score: { order: "desc" } },
        { createdAt: { order: "desc" } },
        { id: { order: "desc" } },
      ],
      search_after: cursor,
    });

    const hits = esResult.hits.hits;
    const postIds = Array.from(new Set(hits.map((hit) => hit._source!.postId)));

    if (postIds.length === 0) {
      return { items: [], nextCursor: null };
    }

    const programs = await this.postService.getPostsByIds(postIds);

    const lastHit = hits[hits.length - 1];
    const nextCursor = lastHit?.sort ?? null;

    return {
      items: programs,
      nextCursor,
    };
  }
}
