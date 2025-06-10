import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ZoomAuthService } from "./zoom-auth.service";

@Injectable()
export class ZoomService {
  private readonly baseUrl = "https://api.zoom.us/v2";

  constructor(
    private readonly httpService: HttpService,
    private readonly zoomAuthService: ZoomAuthService,
  ) {}

  async createMeeting(data: any) {
    const body = {
      ...data,
      default_password: true,
      password: "123456",
      settings: {
        join_before_host: false,
        participant_video: false,
        private_meeting: true,
      },
      type: 2,
    };

    const headers = await this.zoomAuthService.getHeaders();
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/me/meetings`, body, {
        headers,
      }),
    );

    return response.data;
  }
}
