import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Role } from "src/shared/enums/role.enum";
import { User } from "../entities/user.entity";
import { Skill } from "src/shared/entities/skill.entity";
import { MentorApplication } from "../entities/mentor-application.entity";
import { SecretService } from "../secret/secret.service";
import { INDEXING_SERVICE } from "src/infra/rabbitmq/rabbitmq.constants";
import { ClientProxy } from "@nestjs/microservices";
import { SignupDto } from "src/shared/dto/signup.dto";
import { SecretType } from "src/shared/enums/secret-type.enum";
import { LoginDto } from "src/shared/dto/login.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { Status } from "src/shared/enums/status.enum";
import { ConvertMentorDto } from "../dto/convert-mentor.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(MentorApplication)
    private readonly mentorApplicationRepository: Repository<MentorApplication>,
    private readonly secretService: SecretService,
    @Inject(INDEXING_SERVICE)
    private readonly indexingServiceRmqClient: ClientProxy,
  ) {}

  async findByIdentifier(identifier: string) {
    return this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });
  }

  async findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  // TODO: return only publicly awailable
  async findByIds(ids: number[]) {
    return this.userRepository.find({
      where: { id: In(ids) },
      relations: ["skills"],
    });
  }

  async getSelfProfile(selfId: number) {
    const user = await this.userRepository.findOne({
      where: { id: selfId },
      relations: ["skills", "mentorApplications"],
    });

    if (!user) throw new NotFoundException("User not found.");

    return user;
  }

  async getPublicProfile({ id, username }: { id?: number; username?: string }) {
    const user = await this.userRepository.findOne({
      where: [{ id }, { username }],
      relations: ["skills"],
    });

    if (!user) throw new NotFoundException("User not found.");

    const {
      email,
      createdAt,
      updatedAt,
      mentorApplications,
      secrets,
      ...publicProfile
    } = user;

    return publicProfile;
  }

  async getSkills() {
    return this.skillRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createUser(dto: SignupDto) {
    const user = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      name: dto.username,
    });

    const savedUser = await this.userRepository.save(user);
    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.secretService.save({
      type: SecretType.PasswordHash,
      value: passwordHash,
      user: savedUser,
    });

    this.indexingServiceRmqClient.emit("user.created", {
      id: savedUser.id,
      bio: "",
      skills: [],
    });

    return savedUser;
  }

  async validateUser(dto: LoginDto) {
    const user = await this.findByIdentifier(dto.identifier);
    if (!user) return null;

    const passwordSecret = await this.secretService.findByType(
      user.id,
      SecretType.PasswordHash,
    );

    if (!passwordSecret) {
      throw new InternalServerErrorException();
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      passwordSecret.value,
    );

    return passwordValid ? user : null;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["skills"],
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { name, username, bio, profileImageUrl, skillIds } = dto;

    try {
      user.name = name ?? user.name;
      user.bio = bio ?? user.bio;
      user.profileImageUrl = profileImageUrl ?? user.profileImageUrl;

      if (skillIds) {
        const skills = await this.skillRepository.findBy({ id: In(skillIds) });
        user.skills = skills;
      }

      if (username && username !== user.username) {
        const existing = await this.userRepository.findOneBy({ username });

        if (existing) {
          throw new BadRequestException("Username has already been taken.");
        }

        user.username = username;
      }
    } finally {
      const savedUser = await this.userRepository.save(user);

      this.indexingServiceRmqClient.emit("user.updated", {
        id: savedUser.id,
        bio: savedUser.bio || "",
        skills: savedUser.skills.map((x) => x.name),
      });
    }

    return this.getSelfProfile(userId);
  }

  async updatePassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const passwordSecret = await this.secretService.findByType(
      user.id,
      SecretType.PasswordHash,
    );

    if (!passwordSecret) {
      throw new InternalServerErrorException();
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    passwordSecret.value = passwordHash;

    await this.secretService.save(passwordSecret);
  }

  async updateRole(userId: number, newRole: Role) {
    await this.userRepository.update(userId, {
      role: newRole,
    });
  }

  async convertMentor(userId: number, dto: ConvertMentorDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["skills"],
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    // Assert important fields
    if (
      !user.bio?.length ||
      !user.profileImageUrl?.length ||
      !user.skills.length
    ) {
      throw new BadRequestException(
        "Please complete your profile before switching to mentor profile. The following fields are required: bio, avatar, and skills.",
      );
    }

    const existingApplication = await this.mentorApplicationRepository.findOne({
      where: {
        user: { id: userId },
        status: Status.Pending,
      },
    });

    if (existingApplication) {
      throw new ConflictException(
        "You have already applied to be a mentor. Please wait for you application to be reviewed.",
      );
    }

    const application = this.mentorApplicationRepository.create({
      user,
      motivation: dto.motivation,
    });

    await this.mentorApplicationRepository.save(application);

    // Send email to admin

    return {
      message:
        "Your application has been successfully submitted. Please wait while we review it. You'll be notified once a decision is made.",
      application,
    };
  }
}
