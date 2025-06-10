import { Inject, Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { IndexingService } from "../indexing.service";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { PROGRAMS_INDEX } from "../../search.constants";
import { EMBEDDING_SERVICE } from "src/infra/rabbitmq/rabbitmq.constants";

@Injectable()
export class ProgramIndexingService extends IndexingService {
  protected indexName = PROGRAMS_INDEX;

  constructor(
    es: ElasticsearchService,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingServiceClient: ClientProxy,
  ) {
    super(es);
  }

  async index(id: string, document: Record<string, any>) {
    const skillsString = (document.skills as string[]).join(", ");
    const embedding = await this.getEmbedding(
      document.title,
      document.description,
      skillsString,
    );
    document.embedding = embedding;
    return super.index(id, document);
  }

  async update(id: string, doc: Record<string, any>) {
    const skillsString = (doc.skills as string[]).join(", ");
    const embedding = await this.getEmbedding(
      doc.title,
      doc.description,
      skillsString,
    );
    doc.embedding = embedding;
    return super.update(id, doc);
  }

  private async getEmbedding(
    title: string,
    description: string,
    skills: string,
  ) {
    const { embedding } = await firstValueFrom(
      this.embeddingServiceClient.send<{ embedding: number[] }>(
        { cmd: "embed" },
        {
          text: `Title: ${title}\nDescription: ${description}\nSkills: ${skills}`,
        },
      ),
    );

    return embedding;
  }

  protected async initIndices() {
    await this.ensureIndex({
      settings: {
        analysis: {
          normalizer: {
            lowercase_normalizer: {
              type: "custom",
              filter: ["lowercase", "asciifolding"],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: "keyword" },
          title: { type: "text" },
          description: { type: "text" },
          type: { type: "keyword" },
          startDate: { type: "date" },
          endDate: { type: "date", null_value: "9999-12-31" },
          maxParticipants: { type: "integer" },
          enrollmentFillRate: { type: "double" },
          skills: { type: "keyword", normalizer: "lowercase_normalizer" },
          createdAt: { type: "date" },
          embedding: {
            type: "dense_vector",
            dims: 384,
            index: true,
            similarity: "cosine",
          },
        },
      },
    });
  }
}
