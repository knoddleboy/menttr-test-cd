import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";
import { Post } from "../entities/post.entity";
import { INDEXING_SERVICE } from "src/infra/rabbitmq/rabbitmq.constants";
import { GetPostsDto } from "./dto/get-posts.dto";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @Inject(INDEXING_SERVICE)
    private readonly indexingServiceRmqClient: ClientProxy,
  ) {}

  async getPosts({ cursor }: GetPostsDto) {
    return this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .select([
        "post.id",
        "post.title",
        "post.content",
        "post.createdAt",
        "post.commentsCount",
        "author.id",
        "author.name",
        "author.username",
        "author.profileImageUrl",
      ])
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }

  async getPostsByIds(postIds: number[]) {
    return this.postRepository.find({
      where: {
        id: In(postIds),
      },
    });
  }

  async createPost(userId: number, dto: CreatePostDto) {
    const post = this.postRepository.create({
      ...dto,
      author: { id: userId },
    });

    const savedPost = await this.postRepository.save(post);

    this.indexingServiceRmqClient.emit("discussion.created", {
      id: savedPost.id,
      type: "post",
      title: savedPost.title,
      content: savedPost.content,
      postId: savedPost.id,
      // upvotesCount: 0,
      // commentsCount: 0,
      createdAt: savedPost.createdAt,
    });

    return savedPost;
  }
}
