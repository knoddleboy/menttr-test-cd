import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProgramService } from "./program.service";
import { Role } from "src/shared/enums/role.enum";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { User } from "src/modules/users/entities/user.entity";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { CurrentUser } from "src/modules/users/decorators/current-user.decorator";

@Controller("programs")
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  getUserPrograms(@Query("user_id", ParseIntPipe) userId: number) {
    return this.programService.getOwnPrograms(userId);
  }

  @Get("joined")
  getJoinedPrograms(@Query("user_id", ParseIntPipe) userId: number) {
    return this.programService.getJoinedPrograms(userId);
  }

  @Get(":programId")
  getProgram(@Param("programId", ParseIntPipe) programId: number) {
    return this.programService.findById(programId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Mentor)
  @Post()
  createProgram(@CurrentUser() user: User, @Body() dto: CreateProgramDto) {
    return this.programService.createProgram(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Mentor)
  @Patch(":programId")
  updateProgram(
    @CurrentUser() user: User,
    @Param("programId", ParseIntPipe) programId: number,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.programService.updateProgram(user.id, programId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Mentor)
  @Post(":programId/archive")
  archiveProgram(
    @CurrentUser() user: User,
    @Param("programId", ParseIntPipe) programId: number,
  ) {
    return this.programService.archiveProgram(user.id, programId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Mentor)
  @Delete(":programId")
  deleteProgram(
    @CurrentUser() user: User,
    @Param("programId", ParseIntPipe) programId: number,
  ) {
    return this.programService.deleteProgram(user.id, programId);
  }
}
