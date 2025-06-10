import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SecretType } from "src/shared/enums/secret-type.enum";
import { User } from "./user.entity";

@Entity("secrets")
export class Secret {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: SecretType })
  type: SecretType;

  @Column()
  value: string;

  @ManyToOne(() => User, (user) => user.secrets, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "expires_at", type: "timestamptz", nullable: true })
  expiresAt: Date;

  // @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  // createdAt: Date;

  // @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  // updatedAt: Date;
}
