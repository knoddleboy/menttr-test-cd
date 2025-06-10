import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Conversation } from "./conversation.entity";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(() => Conversation, (conv) => conv.messages)
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation;

  @Column("text")
  encryptedContent: string;

  @Column({ type: "varchar", length: 255 })
  iv: string;

  @Column({ type: "varchar", length: 255 })
  authTag: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
