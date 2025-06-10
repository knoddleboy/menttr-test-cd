import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { User } from "src/modules/users/entities/user.entity";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "author_id" })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: "post_id" })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "reply_to_id" })
  replyTo?: Comment;

  // Only for top-level comments
  @Column({ name: "replies_count", default: 0 })
  repliesCount: number;

  @OneToMany(() => Comment, (comment) => comment.replyTo)
  replies: Comment[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
