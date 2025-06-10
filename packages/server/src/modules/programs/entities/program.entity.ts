import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProgramStatus } from "../enums/program-status.enum";
import { ProgramType } from "../enums/program-type.enum";
import { Skill } from "src/shared/entities/skill.entity";
import { Participant } from "./participant.entity";
import { ProgramReview } from "./program-rating.entity";

@Entity({ name: "programs" })
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "owner_id" })
  ownerId: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: "enum", enum: ProgramType })
  type: ProgramType;

  @Column({ length: 2000, nullable: true })
  description: string;

  @Column({ name: "start_date", type: "timestamptz" })
  startDate: Date;

  @Column({ name: "end_date", type: "timestamptz", nullable: true }) // can be null for recurring programs
  endDate: Date;

  @Column({ name: "max_participants" })
  maxParticipants: number;

  @Column({ name: "active_participants", default: 0 })
  activeParticipants: number;

  @Column({
    type: "enum",
    enum: ProgramStatus,
    default: ProgramStatus.Enrollment,
  })
  status: ProgramStatus;

  @Column({ name: "meeting_link", length: 200, nullable: true })
  meetingLink: string;

  @ManyToMany(() => Skill, (skill) => skill.programs, { cascade: true })
  @JoinTable({ name: "program_skills" })
  skills: Skill[];

  @OneToMany(() => Participant, (enrollment) => enrollment.program)
  participants: Participant[];

  @Column({ name: "chat_id" })
  chatId: number;

  @OneToMany(() => ProgramReview, (rating) => rating.program)
  reviews: ProgramReview[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
