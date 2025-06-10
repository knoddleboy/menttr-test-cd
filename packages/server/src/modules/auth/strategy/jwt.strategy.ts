import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/users/user/user.service";
import { JwtPayload } from "src/shared/types/jwt-payload";
import { Request as ExpressRequest } from "express";

interface Request extends ExpressRequest {
  cookies: {
    access_token: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const extractors = [(req: Request) => req.cookies.access_token];

    super({
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_TOKEN_SECRET"),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }
}
