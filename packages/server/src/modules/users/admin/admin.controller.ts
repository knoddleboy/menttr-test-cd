import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "src/shared/enums/role.enum";
import { AdminService } from "./admin.service";
import { UpdateApplicationStatusDto } from "../dto/update-application-status.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("applications")
  getApplications() {
    return this.adminService.getApplications();
  }

  @Patch("applications/:id/status")
  updateApplicationStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.adminService.updateApplicationStatus(id, dto);
  }
}
