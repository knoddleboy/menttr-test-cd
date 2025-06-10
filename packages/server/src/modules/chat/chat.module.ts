import { forwardRef, Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Message } from "./entities/message.entity";
import { MessageService } from "./services/message.service";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ConversationParticipant } from "./entities/conversation-participant.entity";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { EncryptionService } from "./services/encryption.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationParticipant, Message]),
    JwtModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, MessageService, ChatService, EncryptionService],
  exports: [ChatService],
})
export class ChatModule {}
