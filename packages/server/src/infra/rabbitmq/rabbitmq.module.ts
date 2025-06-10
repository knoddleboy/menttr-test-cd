import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { EMBEDDING_SERVICE, INDEXING_SERVICE } from "./rabbitmq.constants";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EMBEDDING_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URL")],
            queue: "embedding_queue",
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: INDEXING_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URL")],
            queue: "search_indexing_queue",
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RmqClientsModule {}
