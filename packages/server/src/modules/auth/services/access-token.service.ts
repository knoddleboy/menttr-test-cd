import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/modules/users/user/user.service";
import { JwtPayload } from "src/shared/types/jwt-payload";

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  get tokenExpiresIn() {
    return this.configService.getOrThrow<string>("JWT_ACCESS_TOKEN_TTL");
  }

  async generateAccessToken(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException("User not found.");

    const payload: Partial<JwtPayload> = {
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.tokenExpiresIn,
      secret: this.configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
    });
  }
}
