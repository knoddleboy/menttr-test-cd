import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AccessTokenService } from "./services/access-token.service";
import { RefreshTokenService } from "./services/refresh-token.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtRefreshStrategy } from "./strategy/jwt-refresh.strategy";

@Module({
  imports: [JwtModule, UsersModule],
  providers: [
    AuthService,
    AccessTokenService,
    RefreshTokenService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
