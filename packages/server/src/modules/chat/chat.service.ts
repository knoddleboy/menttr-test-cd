import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Not, Repository } from "typeorm";
import { Status } from "src/shared/enums/status.enum";
import { ConversationParticipant } from "./entities/conversation-participant.entity";
import { UserService } from "../users/user/user.service";
import { User } from "../users/entities/user.entity";
import { Message } from "./entities/message.entity";
import { MessageService } from "./services/message.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
  ) {}

  async getUserConversations(userId: number) {
    const acceptedParticipants = await this.participantRepository.find({
      where: {
        userId,
        status: Status.Accepted,
      },
      relations: ["conversation", "conversation.participants"],
    });

    const conversations = acceptedParticipants.map((p) => p.conversation);

    const allUserIds = new Set<number>();
    conversations.forEach((conversation) => {
      conversation.participants.forEach((p) => allUserIds.add(p.userId));
    });

    const users = await this.userService.findByIds([...allUserIds]);
    const userMap = new Map<number, User>();
    users.forEach((user) => userMap.set(user.id, user));

    const enrichedConversations = conversations.map((conversation) => {
      const enrichedParticipants = conversation.participants.map((p) => ({
        ...p,
        user: userMap.get(p.userId) || null,
      }));

      let title: string;
      let avatarUrl: string | null;

      if (conversation.isDirect) {
        const otherParticipant = enrichedParticipants.find(
          (p) => p.userId !== userId,
        );

        title = conversation.title || otherParticipant?.user?.name || "Unknown";
        avatarUrl = otherParticipant?.user?.profileImageUrl || null;
      } else {
        const names = enrichedParticipants
          .filter((p) => p.userId !== userId)
          .map((p) => p.user?.name)
          .filter(Boolean);

        title = conversation.title || names.join(", ");
        avatarUrl = null;
      }

      return {
        ...conversation,
        participants: enrichedParticipants,
        title,
        avatarUrl,
      };
    });

    const pendingRequestsCount = await this.participantRepository
      .createQueryBuilder("participant")
      .where("participant.user_id = :userId", { userId })
      .andWhere("participant.status = :status", { status: Status.Pending })
      .andWhere((qb) => {
        const sub = qb
          .subQuery()
          .select("1")
          .from("messages", "msgs")
          .where("msgs.conversation_id = participant.conversation_id")
          .limit(1)
          .getQuery();
        return `EXISTS ${sub}`;
      })
      .getCount();

    return {
      conversations: enrichedConversations,
      pendingRequestsCount,
    };
  }

  async getUserPendingConversations(userId: number) {
    const pendingParticipants = await this.participantRepository.find({
      where: {
        userId,
        status: Status.Pending,
      },
      relations: ["conversation", "conversation.participants"],
    });

    const pendingConversations = pendingParticipants.map((p) => p.conversation);

    const allUserIds = new Set<number>();
    pendingConversations.forEach((conversation) => {
      conversation.participants.forEach((p) => allUserIds.add(p.userId));
    });

    const users = await this.userService.findByIds([...allUserIds]);
    const userMap = new Map<number, User>();
    users.forEach((user) => userMap.set(user.id, user));

    const enrichedConversations = pendingConversations.map((conversation) => {
      const enrichedParticipants = conversation.participants.map((p) => ({
        ...p,
        user: userMap.get(p.userId) || null,
      }));

      let title: string;
      let avatarUrl: string | null;

      if (conversation.isDirect) {
        const otherParticipant = enrichedParticipants.find(
          (p) => p.userId !== userId,
        );

        title = otherParticipant?.user?.name || "Unknown";
        avatarUrl = otherParticipant?.user?.profileImageUrl || null;
      } else {
        const names = enrichedParticipants
          .filter((p) => p.userId !== userId)
          .map((p) => p.user?.name)
          .filter(Boolean);

        title = names.join(", ");
        avatarUrl = null;
      }

      return {
        ...conversation,
        participants: enrichedParticipants,
        title,
        avatarUrl,
      };
    });

    return enrichedConversations;
  }

  async getConversation(userId: number, convId: number) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ["participants"],
    });

    if (!conv) {
      return null;
    }

    const userIds = conv.participants.map((p) => p.userId);
    const users = await this.userService.findByIds(userIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    let title: string;
    let avatarUrl: string | null;

    const enrichedParticipants = conv.participants.map((p) => ({
      ...p,
      user: userMap.get(p.userId) || null,
    }));

    if (conv.isDirect) {
      const otherParticipant = enrichedParticipants.find(
        (p) => p.userId !== userId,
      );

      title = conv.title || otherParticipant?.user?.name || "Unknown";
      avatarUrl = otherParticipant?.user?.profileImageUrl || null;
    } else {
      const names = enrichedParticipants
        .filter((p) => p.userId !== userId)
        .map((p) => p.user?.name)
        .filter(Boolean);

      title = conv.title || names.join(", ");
      avatarUrl = null;
    }

    return {
      ...conv,
      participants: enrichedParticipants,
      title,
      avatarUrl,
      ...(await this.messageService.getConversationMessages(convId)),
    };
  }

  async createConversation(creatorId: number, dto: CreateConversationDto) {
    const { userIds, title } = dto;

    const conv = this.conversationRepository.create({
      participants: [
        { userId: creatorId, status: Status.Accepted },
        ...userIds.map((id) => ({ userId: id, status: Status.Pending })),
      ],
      title,
      // If length is 0, then considered to be a group chat created for a program
      isDirect: userIds.length === 1,
    });

    return this.conversationRepository.save(conv);
  }

  async createParticipant(convId: number, userId: number) {
    const participant = this.participantRepository.create({
      conversation: { id: convId },
      userId,
      status: Status.Accepted,
    });

    return this.participantRepository.save(participant);
  }

  async updateParticipantStatus(
    userId: number,
    convId: number,
    status: Status,
  ) {
    if (status === Status.Pending) {
      throw new BadRequestException(
        "Cannot update pending conversation status to 'pending'.",
      );
    }

    await this.participantRepository.update(
      { userId, conversation: { id: convId } },
      {
        status,
      },
    );
  }

  private buildConversationMetadata(
    conv: Conversation,
    currentUserId: number,
    userMap: Map<number, User>,
  ) {
    if (conv.isDirect) {
      const participant = conv.participants.find(
        (p) => p.userId !== currentUserId,
      );
      const user = participant && userMap.get(participant.userId);
      return {
        title: user?.name || "Unknown",
        avatarUrl: user?.profileImageUrl,
      };
    } else {
      const users = conv.participants
        .filter((p) => p.userId !== currentUserId)
        .map((p) => userMap.get(p.userId))
        .filter(Boolean);

      return {
        title: users
          .map((u) => u!.name)
          .join(", ")
          .trimEnd(),
        avatarUrl: null,
      };
    }
  }
}
