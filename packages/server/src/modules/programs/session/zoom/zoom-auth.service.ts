import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ZoomAuthTokenResponse } from "../types/zoom-auth-token-response.type";

@Injectable()
export class ZoomAuthService {
  private accessToken: string | null = null;
  private accessTokenExpiresAt: number | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async getAccessToken() {
    const now = Date.now();

    if (
      this.accessToken &&
      this.accessTokenExpiresAt &&
      now < this.accessTokenExpiresAt
    ) {
      return this.accessToken;
    }

    const accountId = this.configService.getOrThrow<string>("ZOOM_ACCOUNT_ID");
    const data = new URLSearchParams();
    data.append("grant_type", "account_credentials");
    data.append("account_id", accountId);

    const clientId = this.configService.getOrThrow("ZOOM_CLIENT_ID");
    const clientSecret = this.configService.getOrThrow("ZOOM_CLIENT_SECRET");
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );

    const response = await firstValueFrom(
      this.httpService.post<ZoomAuthTokenResponse>(
        "https://zoom.us/oauth/token",
        data.toString(),
        {
          headers: {
            Host: "zoom.us",
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      ),
    );

    this.accessToken = response.data.access_token;
    this.accessTokenExpiresAt =
      now + response.data.expires_in * 1000 - 10 * 1000;

    return response.data.access_token;
  }

  async getHeaders() {
    const accessToken = await this.getAccessToken();

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  generateSignature(dto: any) {
    const { meetingNumber, role, expirationSeconds, videoWebRtcMode } = dto;

    const sdkKey = this.configService.getOrThrow("ZOOM_MEETING_SDK_KEY");
    const sdkSecret = this.configService.getOrThrow("ZOOM_MEETING_SDK_SECRET");

    const iat = Math.floor(Date.now() / 1000);
    const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2;

    const payload = {
      appKey: sdkKey,
      sdkKey,
      mn: meetingNumber,
      role,
      iat,
      exp,
      tokenExp: exp,
      video_webrtc_mode: videoWebRtcMode,
    };

    const signature = this.jwtService.sign(payload, {
      secret: sdkSecret,
      algorithm: "HS256",
      header: { alg: "HS256", typ: "JWT" },
    });

    return {
      signature,
      sdkKey,
    };
  }

  // private async fetchZak(userId: string): Promise<string> {
  //   const url = `https://api.zoom.us/v2/users/${userId}/token?type=zak`;

  //   const response = await firstValueFrom(
  //     this.httpService.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${this.jwtToken}`,
  //       },
  //     }),
  //   );

  //   return response.data.token;
  // }
}
