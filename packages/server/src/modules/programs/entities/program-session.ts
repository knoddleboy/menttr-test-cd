import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Program } from "./program.entity";
import { SessionParticipant } from "./session-participant";

@Entity({ name: "program_sessions" })
export class ProgramSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "meeting_id" })
  meetingId: string;

  @Column({ name: "meeting_password" })
  meetingPassword: string;

  @Column()
  topic: string;

  @Column()
  agenda: string;

  @Column({ name: "start_time", type: "timestamptz" })
  startTime: Date;

  @Column({ name: "end_time", type: "timestamptz" })
  endTime: Date;

  @Column({ type: "boolean", default: false })
  completed: boolean;

  @Column({ name: "host_id" })
  hostId: number;

  @ManyToOne(() => Program, (program) => program.participants)
  @JoinColumn({ name: "program_id" })
  program: Program;

  @OneToMany(() => SessionParticipant, (sp) => sp.session, { cascade: true })
  participants: SessionParticipant[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
