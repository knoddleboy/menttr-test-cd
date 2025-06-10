import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AdminModule } from "./admin/admin.module";
import { SecretModule } from "./secret/secret.module";

@Module({
  imports: [UserModule, AdminModule, SecretModule],
  exports: [UserModule, SecretModule],
})
export class UsersModule {}
