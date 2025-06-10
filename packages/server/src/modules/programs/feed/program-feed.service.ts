import { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";
import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ProgramFeedQueryDto } from "./dto/program-feed-query.dto";
import { PROGRAMS_INDEX, USERS_INDEX } from "src/infra/elasticsearch/constants";
import { ProgramService } from "../program/program.service";
import { base64EncodeArray } from "src/shared/libs/base64";

@Injectable()
export class ProgramFeedService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly programService: ProgramService,
  ) {}

  async getProgramFeed(userId: number | null, queryDto: ProgramFeedQueryDto) {
    const { cursor } = queryDto;

    const now = Date.now();
    let query: QueryDslQueryContainer;

    if (userId) {
      const userDoc = await this.es.get<{ embedding: number[] }>({
        index: USERS_INDEX,
        id: userId.toString(),
      });
      const userEmbedding = userDoc._source!.embedding;

      query = {
        script_score: {
          query: { match_all: {} },
          script: {
            source: "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
            params: {
              query_vector: userEmbedding,
            },
            // source: `
            //   double sim = cosineSimilarity(params.query_vector, 'embedding');
            //   double freshness = 1 / (1 + Math.pow(params.now - doc['createdAt'].value.toInstant().toEpochMilli(), 0.3));
            //   return sim * 0.7 + freshness * 0.3;
            // `,
            // params: {
            //   query_vector: userEmbedding,
            //   now,
            // },
          },
        },
      };
    } else {
      query = {
        function_score: {
          query: { match_all: {} },
          functions: [
            // {
            //   gauss: {
            //     createdAt: {
            //       origin: "now",
            //       scale: "10d",
            //       decay: 0.5,
            //     },
            //   },
            //   weight: 1.0,
            // },
            // {
            //   field_value_factor: {
            //     field: "enrollmentFillRate",
            //     factor: 1.2,
            //     missing: 1,
            //   },
            //   weight: 0.3,
            // },
          ],
          score_mode: "sum",
          boost_mode: "sum",
        },
      };
    }

    const esResult = await this.es.search({
      index: PROGRAMS_INDEX,
      size: 5,
      query,
      _source: ["title", "startDate", "createdAt"],
      sort: [
        { _score: { order: "desc" } },
        { startDate: { order: "asc" } },
        { id: { order: "desc" } },
      ],
      search_after: cursor,
    });

    const hits = esResult.hits.hits;

    const excludeIds =
      (userId &&
        (await this.programService.getOwnPrograms(userId)).active.items.map(
          (x) => x.id,
        )) ||
      [];

    const programIds = Array.from(new Set(hits.map((hit) => +hit._id!))).filter(
      (id) => !excludeIds.includes(id),
    );

    if (programIds.length === 0) {
      return { items: [], nextCursor: null };
    }

    const data = await this.programService.findByIds(programIds);

    const lastHit = hits[hits.length - 1];
    const nextCursor = lastHit?.sort ? base64EncodeArray(lastHit?.sort) : null;

    // console.log(lastHit?.sort);
    // console.log(nextCursor);

    return {
      items: data,
      nextCursor,
    };
  }
}
