import { Module } from "@nestjs/common";
import { SecretService } from "./secret.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Secret } from "../entities/secret.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Secret])],
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretModule {}
