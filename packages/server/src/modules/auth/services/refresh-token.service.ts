import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/modules/users/user/user.service";
import { addMilliseconds } from "date-fns";
import ms, { StringValue } from "ms";
import { JwtPayload } from "src/shared/types/jwt-payload";
import { SecretService } from "src/modules/users/secret/secret.service";
import { SecretType } from "src/shared/enums/secret-type.enum";
import { ValidateRefreshTokenResult } from "../types/validate-refresh-token-result";

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly secretService: SecretService,
    private readonly jwtService: JwtService,
  ) {}

  get tokenExpiresIn() {
    return this.configService.getOrThrow<string>("JWT_REFRESH_TOKEN_TTL");
  }

  get tokenExpiresInMs() {
    return ms(this.tokenExpiresIn as StringValue);
  }

  async generateRefreshToken(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException("User not found.");

    const expiresAt = addMilliseconds(
      new Date().getTime(),
      this.tokenExpiresInMs,
    );

    const refreshToken = await this.secretService.save({
      user: { id: userId },
      type: SecretType.RefreshToken,
      value: "",
      expiresAt,
    });

    const payload: Partial<JwtPayload> = {
      sub: userId,
      jti: refreshToken.id,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.tokenExpiresIn,
      secret: this.configService.getOrThrow("JWT_REFRESH_TOKEN_SECRET"),
    });
  }

  async validateRefreshToken(
    payload: JwtPayload,
  ): Promise<ValidateRefreshTokenResult> {
    if (!payload.jti) {
      throw new BadRequestException("Invalid or expired token.");
    }

    const storedToken = await this.secretService.findById(payload.jti);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new BadRequestException("Invalid or expired token.");
    }

    const user = await this.userService.findById(storedToken.user.id);

    if (!user) {
      throw new NotFoundException(
        "User associated with this token is not found.",
      );
    }

    return {
      userId: storedToken.user.id,
      refreshTokenId: storedToken.id,
    };
  }

  async invalidateRefreshToken(jti: number) {
    await this.secretService.deleteById(jti);
  }
}
