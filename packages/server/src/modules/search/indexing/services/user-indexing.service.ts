import { Inject, Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { IndexingService } from "../indexing.service";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { USERS_INDEX } from "../../search.constants";
import { EMBEDDING_SERVICE } from "src/infra/rabbitmq/rabbitmq.constants";

@Injectable()
export class UserIndexingService extends IndexingService {
  protected indexName = USERS_INDEX;

  constructor(
    es: ElasticsearchService,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingServiceClient: ClientProxy,
  ) {
    super(es);
  }

  async index(id: string, document: Record<string, any>) {
    const skillsString = (document.skills as string[]).join(", ");
    const embedding = await this.getEmbedding(document.bio, skillsString);
    document.embedding = embedding;
    return super.index(id, document);
  }

  async update(id: string, doc: Record<string, any>) {
    const skillsString = (doc.skills as string[]).join(", ");
    const embedding = await this.getEmbedding(doc.bio, skillsString);
    doc.embedding = embedding;
    return super.update(id, doc);
  }

  private async getEmbedding(bio: string, skills: string) {
    const { embedding } = await firstValueFrom(
      this.embeddingServiceClient.send<{ embedding: number[] }>(
        { cmd: "embed" },
        {
          text: `Bio: ${bio}\nSkills: ${skills}`,
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
          bio: { type: "text" },
          skills: { type: "keyword", normalizer: "lowercase_normalizer" },
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
