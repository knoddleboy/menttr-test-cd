import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { FeedQueryDto } from "./dtos/feed-query.dto";
import { DISCUSSIONS_INDEX } from "src/infra/elasticsearch/constants";

@Injectable()
export class FeedService {
  constructor(private readonly es: ElasticsearchService) {}

  async getDiscussionFeed(queryDto: FeedQueryDto) {
    const { cursor } = queryDto;

    const esResult = await this.es.search<{ postId: string }>({
      index: DISCUSSIONS_INDEX,
      size: 10,
      query: {
        function_score: {
          query: {
            bool: {
              must: {
                match_all: {},
              },
            },
          },
          functions: [
            {
              filter: { term: { type: "post" } },
              weight: 1,
            },
            {
              field_value_factor: {
                field: "upvotesCount",
                factor: 1.5,
                modifier: "sqrt",
                missing: 0,
              },
            },
            {
              field_value_factor: {
                field: "commentsCount",
                factor: 1.5,
                modifier: "sqrt",
                missing: 0,
              },
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
          boost_mode: "sum",
          score_mode: "sum",
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

    return hits;

    // if (postIds.length === 0) {
    //   return { items: [], nextCursor: null };
    // }

    // const { data } = await firstValueFrom(
    //   this.httpService.post<any[]>("http://localhost:3005/posts/bulk", {
    //     postIds,
    //   }),
    // );

    // const lastHit = hits[hits.length - 1];
    // const nextCursor = lastHit?.sort ?? null;

    // return {
    //   items: data,
    //   nextCursor,
    // };
  }
}
