import { EncryptionService } from "./encryption.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../entities/message.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "../dto/create-message.dto";
import { UserService } from "src/modules/users/user/user.service";

@Injectable()
export class MessageService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(userId: number, messageDto: CreateMessageDto) {
    const { encrypted, iv, authTag } = this.encryptionService.encrypt(
      messageDto.content,
    );

    const message = await this.messageRepository.save({
      userId,
      conversation: { id: messageDto.conversationId },
      encryptedContent: encrypted,
      iv,
      authTag,
    });

    return this.findMessage(message.id);
  }

  async findMessage(messageId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      return null;
    }

    const user = await this.userService.getPublicProfile({
      id: message.userId,
    });

    return {
      ...this.getDecryptedMessage(message),
      user,
    };
  }

  async getConversationMessages(convId: number) {
    const messages = await this.messageRepository.find({
      where: { conversation: { id: convId } },
    });

    const userIds = [...new Set(messages.map((msg) => msg.userId))];
    const users = await Promise.all(
      userIds.map((id) => this.userService.getPublicProfile({ id })),
    );
    const userMap = new Map<number, any>();
    userIds.forEach((id, idx) => {
      userMap.set(id, users[idx]);
    });

    return {
      messages: messages.map((message) => ({
        ...this.getDecryptedMessage(message),
        user: userMap.get(message.userId),
      })),
    };
  }

  getDecryptedMessage(message: Message) {
    const { encryptedContent, iv, authTag, ...rest } = message;

    const content = this.encryptionService.decrypt(
      message.encryptedContent,
      message.iv,
      message.authTag,
    );

    return {
      message: {
        ...rest,
        content,
      },
    };
  }
}
