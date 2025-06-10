import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../users/entities/user.entity";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { ChatService } from "./chat.service";
import { UpdatePendingConversationDto } from "./dto/update-pending-conversation.dto";

@UseGuards(JwtAuthGuard)
@Controller("conversations")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getConversations(@CurrentUser() user: User) {
    return this.chatService.getUserConversations(user.id);
  }

  @Get("/pending")
  async getPendingConversations(@CurrentUser() user: User) {
    return this.chatService.getUserPendingConversations(user.id);
  }

  @Get(":convId")
  async getConversation(
    @CurrentUser() user: User,
    @Param("convId", ParseIntPipe) convId: number,
  ) {
    return this.chatService.getConversation(user.id, convId);
  }

  @Post("create")
  async createConversation(
    @CurrentUser() user: User,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(user.id, dto);
  }

  @Patch(":convId/pending")
  async updateUserPendingConversation(
    @CurrentUser() user: User,
    @Param("convId", ParseIntPipe) convId: number,
    @Body() dto: UpdatePendingConversationDto,
  ) {
    return this.chatService.updateParticipantStatus(
      user.id,
      convId,
      dto.status,
    );
  }
}
