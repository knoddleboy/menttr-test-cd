import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "src/shared/dto/signup.dto";
import { LoginDto } from "src/shared/dto/login.dto";
import { Response } from "express";
import { getCookieOptions } from "./utils/cookie";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { AuthResult } from "./types/auth-result";
import { ValidateRefreshTokenResult } from "./types/validate-refresh-token-result";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private handleAuthResponse(tokens: AuthResult, res: Response) {
    const { accessToken, refreshToken } = tokens;

    res.cookie("access_token", accessToken, getCookieOptions("access"));
    res.cookie("refresh_token", refreshToken, getCookieOptions("refresh"));

    return { success: true };
  }

  @Post("signup")
  async signUp(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(dto);
    return this.handleAuthResponse(tokens, res);
  }

  @Post("login")
  async logIn(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.logIn(dto);
    return this.handleAuthResponse(tokens, res);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logOut(
    @Req() { user }: { user: { id: number } },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logOut(user.id);

    res.clearCookie("access_token", getCookieOptions("access"));
    res.clearCookie("refresh_token", getCookieOptions("refresh"));

    return { success: true };
  }

  @Post("refresh")
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() { user }: { user: ValidateRefreshTokenResult },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, refreshTokenId } = user;
    const tokens = await this.authService.refreshTokens(userId, refreshTokenId);
    return this.handleAuthResponse(tokens, res);
  }

  @Post("forgot-password")
  @HttpCode(200)
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    await this.authService.sendResetPasswordEmail(email);
    return {
      message:
        "If your email is registered, you'll receive a password reset link shortly.",
    };
  }

  @Post("reset-password")
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    await this.authService.resetPassword(token, newPassword);
    return {
      message: "Your password has been reset successfully.",
    };
  }
}
