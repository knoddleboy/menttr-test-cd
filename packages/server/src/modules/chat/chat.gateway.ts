import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { MessageService } from "./services/message.service";
import { Server } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { WsAuthGuard } from "./guards/ws-auth.guard";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CurrentWsUser } from "./decorators/current-ws-user.decorator";
import { JwtPayload } from "src/shared/types/jwt-payload";

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage("sendMessage")
  async handleMessage(
    @MessageBody() messageDto: CreateMessageDto,
    @CurrentWsUser() user: JwtPayload,
  ) {
    const message = await this.messageService.createMessage(
      user.sub,
      messageDto,
    );

    this.server.emit(`conversations/${messageDto.conversationId}`, message);
  }

  // async handleConnection(client: Socket) {
  //   const user = client.data.user;
  //   const conversations = await this.conversationService.getUserConversations(
  //     user.id,
  //   );
  //   conversations.forEach((conv) => void client.join(conv.id.toString()));
  // }

  // @SubscribeMessage("sendMessage")
  // async handleSendMessage(
  //   @MessageBody() dto: SendMessageDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const user = client.data.user;

  //   const isAllowed = await this.conversationService.isUserParticipant(
  //     dto.conversationId,
  //     user.id,
  //   );
  //   if (!isAllowed) {
  //     client.emit("error", { message: "Unauthorized." });
  //     return;
  //   }

  //   const conv = await this.conversationService.findById(dto.conversationId);

  //   if (!conv) {
  //     client.emit("error", { message: "Conversation not found." });
  //     return;
  //   }

  //   const savedMessage = await this.messageService.saveMessage(
  //     dto.content,
  //     user.id,
  //     conv.id,
  //   );

  //   this.server.to(conv.id.toString()).emit("newMessage", {
  //     id: savedMessage.id,
  //     content: savedMessage.content,
  //     sender: savedMessage.sender.id,
  //     createdAt: savedMessage.createdAt,
  //   });
  // }

  // @SubscribeMessage("joinConversation")
  // async handleJoin(
  //   @MessageBody() dto: JoinConversationDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const user = client.data.user;
  //   const isAllowed = await this.conversationService.isUserParticipant(
  //     dto.conversationId,
  //     user.id,
  //   );
  //   if (!isAllowed) return;

  //   void client.join(dto.conversationId.toString());
  //   this.server
  //     .to(dto.conversationId.toString())
  //     .emit("userJoined", { userId: user.id });
  // }
}
