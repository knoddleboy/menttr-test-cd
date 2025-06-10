import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./infra/database/database.module";
import { ElasticsearchModule } from "./infra/elasticsearch/elasticsearch.module";
import { RmqClientsModule } from "./infra/rabbitmq/rabbitmq.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ProgramsModule } from "./modules/programs/programs.module";
import { DiscussionModule } from "./modules/discussions/discussion.module";
import { SearchEngineModule } from "./modules/search/search.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, "../..", "web", "dist"),
      rootPath: join(__dirname, "../", "public"),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: "../../../.env",
    }),
    DatabaseModule,
    ElasticsearchModule,
    RmqClientsModule,
    AuthModule,
    UsersModule,
    ProgramsModule,
    DiscussionModule,
    SearchEngineModule,
    ChatModule,
  ],
})
export class AppModule {}
