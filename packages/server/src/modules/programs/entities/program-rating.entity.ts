import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Program } from "./program.entity";

@Entity("program_reviews")
// @Unique(["user", "course"]) // Prevent duplicate ratings by the same user for the same course
export class ProgramReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column("smallint")
  rating: number;

  @Column({ type: "text", nullable: true })
  content: string;

  @ManyToOne(() => Program, (program) => program.reviews)
  @JoinColumn({ name: "program_id" })
  program: Program;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
