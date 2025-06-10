import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { ClientProxy } from "@nestjs/microservices";
import { Post } from "../entities/post.entity";
import { INDEXING_SERVICE } from "src/infra/rabbitmq/rabbitmq.constants";
import { Comment } from "../entities/comment.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(INDEXING_SERVICE)
    private readonly indexingServiceRmqClient: ClientProxy,
  ) {}

  async getComments(postId: number) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) throw new NotFoundException("Post not found.");

    const comments = await this.commentRepository.find({
      where: {
        post: { id: postId },
        replyTo: IsNull(),
      },
      order: { createdAt: "desc" },
    });

    return comments;
  }

  async getReplies(commentId: number) {
    const parentComment = await this.commentRepository.findOneBy({
      id: commentId,
    });

    if (!parentComment) {
      throw new NotFoundException("Comment not found.");
    }

    const replies = await this.commentRepository.find({
      where: { replyTo: { id: commentId } },
      order: { createdAt: "desc" },
    });

    return replies;
  }

  async createComment(userId: number, postId: number, dto: CreateCommentDto) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) throw new NotFoundException("Post not found.");

    const comment = this.commentRepository.create({
      post: { id: postId },
      content: dto.content,
      author: { id: userId },
    });

    const savedComment = await this.commentRepository.save(comment);

    await this.postRepository.increment({ id: postId }, "commentsCount", 1);

    // this.rmqClient.emit("discussion.created", {
    //   id: savedComment.id,
    //   type: "comment",
    //   content: savedComment.content,
    //   postId: savedComment.postId,
    //   upvotesCount: 0,
    //   commentsCount: 0,
    //   createdAt: savedComment.createdAt,
    // });

    // this.rmqClient.emit("discussion.updated", {
    //   id: postId,
    //   commentsCount: post.commentsCount + 1,
    // });

    return savedComment;
  }

  async createReply(userId: number, commentId: number, dto: CreateCommentDto) {
    const parent = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ["post"],
    });

    if (!parent) {
      throw new NotFoundException("Post not found.");
    }

    if (parent.replyTo) {
      throw new BadRequestException("Cannot reply to a reply.");
    }

    const reply = this.commentRepository.create({
      post: parent.post,
      replyTo: parent,
      content: dto.content,
      author: { id: userId },
    });

    const savedReply = await this.commentRepository.save(reply);

    await this.commentRepository.increment(
      { id: commentId },
      "repliesCount",
      1,
    );

    // this.rmqClient.emit("discussion.created", {
    //   id: savedReply.id,
    //   type: "reply",
    //   content: savedReply.content,
    //   postId: savedReply.postId,
    //   upvotesCount: 0,
    //   commentsCount: 0,
    //   createdAt: savedReply.createdAt,
    // });

    // this.rmqClient.emit("discussion.updated", {
    //   id: commentId,
    //   commentsCount: parent.repliesCount + 1,
    // });

    return savedReply;
  }
}
