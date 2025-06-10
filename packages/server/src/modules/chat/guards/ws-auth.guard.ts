import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import * as cookie from "cookie";
import { Socket } from "socket.io";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const cookies = client.handshake.headers.cookie;

    if (!cookies) throw new WsException("Missing cookies");

    const { access_token } = cookie.parse(cookies);

    if (!access_token) throw new WsException("Invalid token.");

    try {
      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: this.configService.getOrThrow<string>(
          "JWT_ACCESS_TOKEN_SECRET",
        ),
      });
      client.data.user = payload;
      return true;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        client.emit("unauthorized");
      }

      throw new WsException("Invalid token");
    }
  }
}
