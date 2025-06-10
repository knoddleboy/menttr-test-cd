import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ProgramIndexingService } from "../services/program-indexing.service";

@Controller()
export class ProgramIndexingController {
  constructor(
    private readonly programIndexingService: ProgramIndexingService,
  ) {}

  @EventPattern("program.created")
  async onProgramCreated(@Payload() data: any) {
    await this.programIndexingService.index(data.id, data);
  }

  @EventPattern("program.updated")
  async onProgramUpdated(@Payload() data: any) {
    await this.programIndexingService.update(data.id, data);
  }

  @EventPattern("program.deleted")
  async onProgramDeleted(@Payload() data: any) {
    await this.programIndexingService.delete(data.id);
  }

  @EventPattern("program.archived")
  async onProgramArchived(@Payload() data: any) {
    await this.programIndexingService.delete(data.id);
  }

  @EventPattern("program.enrollment.closed")
  async onProgramEnrollmentClosed(@Payload() data: any) {
    await this.programIndexingService.delete(data.id);
  }
}
