import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request as ExpressRequest } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/shared/types/jwt-payload";
import { RefreshTokenService } from "../services/refresh-token.service";

interface Request extends ExpressRequest {
  cookies: {
    refresh_token: string;
  };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    const extractors = [(req: Request) => req.cookies.refresh_token];

    super({
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      secretOrKey: configService.getOrThrow("JWT_REFRESH_TOKEN_SECRET"),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    return this.refreshTokenService.validateRefreshToken(payload);
  }
}
