import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Role } from "src/shared/enums/role.enum";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";
import { User } from "../entities/user.entity";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { ConvertMentorDto } from "../dto/convert-mentor.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile/self")
  getSelfProfile(@CurrentUser() user: User) {
    return this.userService.getSelfProfile(user.id);
  }

  @Get("profile/:username")
  getPublicProfile(@Param("username") username: string) {
    return this.userService.getPublicProfile({ username });
  }

  @Get("skills")
  getSkills() {
    return this.userService.getSkills();
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Mentee)
  @Post("profile/convert-mentor")
  convertToMentor(@CurrentUser() user: User, @Body() dto: ConvertMentorDto) {
    return this.userService.convertMentor(user.id, dto);
  }
}
