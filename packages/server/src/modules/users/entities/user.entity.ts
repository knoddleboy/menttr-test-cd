import { Role } from "src/shared/enums/role.enum";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Skill } from "src/shared/entities/skill.entity";
import { MentorApplication } from "./mentor-application.entity";
import { Secret } from "./secret.entity";
import { UserLocation } from "./user-location.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ enum: Role, default: Role.Mentee })
  role: Role;

  @Column({ name: "name", length: 50 })
  name: string;

  @Column({ length: 32 })
  username: string;

  @Column({ name: "profile_image_url", type: "varchar", nullable: true })
  profileImageUrl: string | null;

  @Column({ type: "varchar", length: 600, nullable: true })
  bio: string | null;

  @ManyToMany(() => Skill, (skill) => skill.users, { cascade: true })
  @JoinTable({ name: "user_skills" })
  skills: Skill[];

  @OneToMany(() => MentorApplication, (application) => application.user)
  mentorApplications: MentorApplication[];

  @OneToOne(() => UserLocation, { cascade: true, eager: true })
  @JoinColumn({ name: "location_id" })
  location: UserLocation;

  @Column({ type: "varchar", nullable: true })
  social: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => Secret, (secret) => secret.user)
  secrets: Secret[];
}
