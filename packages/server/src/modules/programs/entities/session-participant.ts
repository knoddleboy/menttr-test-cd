import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProgramSession } from "./program-session";

@Entity("session_participants")
export class SessionParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProgramSession, (session) => session.participants)
  @JoinColumn({ name: "session_id" })
  session: ProgramSession;

  @Column({ name: "user_id" })
  userId: number;
}
