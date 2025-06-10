import { ZoomAuthService } from "./zoom/zoom-auth.service";
import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "src/shared/enums/role.enum";
import { SessionService } from "./session.service";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";
import { User } from "src/modules/users/entities/user.entity";
import { ScheduleSessionDto } from "./dto/schedule-session.dto";

@Controller("sessions")
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly zoomAuthService: ZoomAuthService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Mentor)
  @Post()
  async createScheduledSession(
    @CurrentUser() user: User,
    @Body() dto: ScheduleSessionDto,
  ) {
    return this.sessionService.createScheduledSession(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getScheduledSession(@CurrentUser() user: User) {
    return this.sessionService.getUserSessions(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("zoom/signature")
  getZoomSignature(
    // @Body() body: { meetingNumber: string; isHost: boolean; userId?: string },
    @Body() dto: any,
  ) {
    return this.zoomAuthService.generateSignature(dto);
  }
}
