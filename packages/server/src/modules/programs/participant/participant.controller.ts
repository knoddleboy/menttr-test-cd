import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { User } from "src/modules/users/entities/user.entity";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";
import { ParticipantService } from "./participant.service";
import { UpdateParticipantStatusDto } from "./dto/update-participant-status.dto";
import { CreateParticipantDto } from "./dto/create-participant.dto";

@Controller()
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @UseGuards(OptionalAuthGuard)
  @Get("participants")
  getEnrollments(
    @CurrentUser({ optional: true }) user: User | null,
    @Query("program_id", ParseIntPipe) programId: number,
  ) {
    return this.participantService.getParticipants(user?.id, programId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("participants/self")
  getExistingEnrollment(
    @CurrentUser() user: User,
    @Query("program_id", ParseIntPipe) programId: number,
  ) {
    return this.participantService.getParticipant(user.id, programId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("programs/:programId/apply")
  createEnrollment(
    @CurrentUser() user: User,
    @Param("programId", ParseIntPipe) programId: number,
    @Body() dto: CreateParticipantDto,
  ) {
    return this.participantService.createParticipant(user.id, programId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("participants/:participantId/status")
  updateEnrollmentStatus(
    @CurrentUser() user: User,
    @Param("participantId", ParseIntPipe) participantId: number,
    @Body() dto: UpdateParticipantStatusDto,
  ) {
    return this.participantService.updateParticipantStatus(
      user.id,
      participantId,
      dto,
    );
  }
}
