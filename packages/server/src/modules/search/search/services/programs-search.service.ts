import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ProgramsSearchQueryDto } from "../dto/programs-search-query.dto";
import { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";
import { DEFAULT_PAGE_SIZE, PROGRAMS_INDEX } from "../../search.constants";
import { ProgramService } from "src/modules/programs/program/program.service";

@Injectable()
export class ProgramsSearchService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly programService: ProgramService,
  ) {}

  async search(userId: number | undefined, queryDto: ProgramsSearchQueryDto) {
    const { query, cursor, ...filters } = queryDto;

    const must: QueryDslQueryContainer[] = [];
    const filter: QueryDslQueryContainer[] = [
      { range: { startDate: { gte: "now" } } },
    ];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ["title^3", "description", "skills^2"],
          fuzziness: "auto",
        },
      });
    }

    if (filters.type) {
      filter.push({ term: { type: filters.type } });
    }

    if (filters.start_date) {
      filter.push({
        range: { startDate: { gte: filters.start_date } },
      });
    }

    if (filters.end_date) {
      filter.push({
        range: { endDate: { lte: filters.end_date } },
      });
    }

    if (filters.max_participants) {
      filter.push({
        range: { maxParticipants: { lte: filters.max_participants } },
      });
    }

    if (filters.skills && filters.skills.length > 0) {
      filter.push({ terms: { skills: filters.skills } });
    }

    const results = await this.es.search<{ id: string }>({
      index: PROGRAMS_INDEX,
      size: DEFAULT_PAGE_SIZE,
      query: {
        function_score: {
          query: {
            bool: {
              ...(must.length > 0 ? { must } : {}),
              ...(filter.length > 0 ? { filter } : {}),
            },
          },
          functions: [
            {
              gauss: {
                startDate: {
                  origin: "now",
                  scale: "14d",
                  decay: 0.5,
                },
              },
              weight: 0.5,
            },
          ],
          boost_mode: "sum",
        },
      },
      sort: [
        { _score: { order: "desc" } },
        { startDate: { order: "asc" } },
        { id: { order: "desc" } },
      ],
      search_after: cursor,
    });

    const hits = results.hits.hits;

    const excludeIds =
      (userId &&
        (await this.programService.getOwnPrograms(userId)).active.items.map(
          (x) => x.id,
        )) ||
      [];

    const programIds = Array.from(
      new Set(hits.map((hit) => +hit._source!.id)),
    ).filter((id) => !excludeIds.includes(id));

    if (programIds.length === 0) {
      return { items: [], nextCursor: null };
    }

    const programs = await this.programService.findByIds(programIds);

    const lastHit = hits[hits.length - 1];
    const nextCursor = lastHit?.sort ?? null;

    return {
      items: programs,
      nextCursor,
    };
  }
}
