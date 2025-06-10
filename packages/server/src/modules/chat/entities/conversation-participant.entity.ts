import { Status } from "src/shared/enums/status.enum";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversation } from "./conversation.entity";

@Entity("conversation_participants")
export class ConversationParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({
    type: "enum",
    enum: Status,
  })
  status: Status;

  @ManyToOne(() => Conversation, (conv) => conv.participants)
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation;
}
