import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ElasticsearchModule as NestElasticsearchModule } from "@nestjs/elasticsearch";

@Module({
  imports: [
    NestElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.getOrThrow("ELASTICSEARCH_NODE"),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NestElasticsearchModule],
})
export class ElasticsearchModule {}
