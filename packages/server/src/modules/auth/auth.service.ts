import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import * as crypto from "crypto";
import { UserService } from "src/modules/users/user/user.service";
import { SignupDto } from "src/shared/dto/signup.dto";
import { LoginDto } from "src/shared/dto/login.dto";
import { AccessTokenService } from "./services/access-token.service";
import { RefreshTokenService } from "./services/refresh-token.service";
import { AuthResult } from "./types/auth-result";
import { SecretService } from "src/modules/users/secret/secret.service";
import { SecretType } from "src/shared/enums/secret-type.enum";
import { addMinutes } from "date-fns";
import { encodeSHA256 } from "src/shared/libs/sha256";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly secretService: SecretService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  private async generateTokens(userId: number): Promise<AuthResult> {
    const accessToken =
      await this.accessTokenService.generateAccessToken(userId);
    const refreshToken =
      await this.refreshTokenService.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  async signUp(dto: SignupDto): Promise<AuthResult> {
    const existing = await this.userService.findByIdentifier(dto.email);
    if (existing) throw new ConflictException("User already exists.");
    const user = await this.userService.createUser(dto);
    return this.generateTokens(user.id);
  }

  async logIn(dto: LoginDto): Promise<AuthResult> {
    const user = await this.userService.validateUser(dto);
    if (!user) throw new ConflictException("Incorrect email or password.");
    return this.generateTokens(user.id);
  }

  async logOut(userId: number) {
    const refreshTokenSecret = await this.secretService.findByType(
      userId,
      SecretType.RefreshToken,
    );

    if (refreshTokenSecret) {
      await this.refreshTokenService.invalidateRefreshToken(
        refreshTokenSecret.id,
      );
    }
  }

  async refreshTokens(userId: number, oldTokenId: number): Promise<AuthResult> {
    await this.refreshTokenService.invalidateRefreshToken(oldTokenId);
    return this.generateTokens(userId);
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userService.findByIdentifier(email);
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await encodeSHA256(rawToken);

    const expiresAt = addMinutes(new Date().getTime(), 15);

    await this.secretService.save({
      type: SecretType.PasswordResetToken,
      value: hashedToken,
      expiresAt,
      user,
    });

    const url = `http://localhost:5000/reset-password?token=${rawToken}`;
    console.log(`Reset link: ${url}`);
  }

  async resetPassword(rawToken: string, newPassword: string) {
    const hashedToken = await encodeSHA256(rawToken);
    const storedToken = await this.secretService.findByValueAndType(
      hashedToken,
      SecretType.PasswordResetToken,
    );

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new BadRequestException("Invalid or expired token");
    }

    const userId = storedToken.user.id;
    await this.userService.updatePassword(userId, newPassword);

    await this.secretService.deleteAllByUserAndType(
      userId,
      SecretType.PasswordResetToken,
    );
  }
}
