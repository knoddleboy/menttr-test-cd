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
import { Status } from "src/shared/enums/status.enum";

@Entity({ name: "participants" })
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  // TODO: do not delete enrollment if program deleted but mark as deleted on client?
  @ManyToOne(() => Program, (program) => program.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "program_id" })
  program: Program;

  @Column()
  motivation: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.Pending,
  })
  status: Status;

  @Column({
    name: "rejection_reason",
    type: "varchar",
    nullable: true,
  })
  rejectionReason: string | null;

  @Column({ name: "enrolled_at", type: "timestamptz", nullable: true })
  enrolledAt: Date | null;

  @Column({ name: "rejected_at", type: "timestamptz", nullable: true })
  rejectedAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
