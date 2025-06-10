import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Secret } from "../entities/secret.entity";
import { SecretType } from "src/shared/enums/secret-type.enum";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class SecretService {
  constructor(
    @InjectRepository(Secret)
    private readonly secretRepository: Repository<Secret>,
  ) {}

  save(entityLike: DeepPartial<Secret>) {
    return this.secretRepository.save(entityLike);
  }

  findByType(userId: number, type: SecretType) {
    return this.secretRepository.findOne({
      where: {
        user: { id: userId },
        type,
      },
    });
  }

  findById(id: number) {
    return this.secretRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  findByValueAndType(value: string, type: SecretType) {
    return this.secretRepository.findOne({
      where: { value, type },
      relations: ["user"],
    });
  }

  deleteById(id: number) {
    return this.secretRepository.delete(id);
  }

  deleteAllByUserAndType(userId: number, type: SecretType) {
    return this.secretRepository.delete({
      user: { id: userId },
      type,
    });
  }
}
