import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  Column,
} from "typeorm";
import { Message } from "./message.entity";
import { ConversationParticipant } from "./conversation-participant.entity";

@Entity("conversations")
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true, default: null })
  title: string | null;

  @Column({ name: "is_direct" })
  isDirect: boolean;

  @OneToMany(
    () => ConversationParticipant,
    (convParticipant) => convParticipant.conversation,
    { cascade: true },
  )
  participants: ConversationParticipant[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
