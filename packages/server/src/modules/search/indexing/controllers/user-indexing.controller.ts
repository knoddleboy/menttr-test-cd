import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { UserIndexingService } from "../services/user-indexing.service";

@Controller()
export class UserIndexingController {
  constructor(private readonly userIndexingService: UserIndexingService) {}

  @EventPattern("user.created")
  async onUserCreated(@Payload() data: any) {
    await this.userIndexingService.index(data.id, data);
  }

  @EventPattern("user.updated")
  async onUserUpdated(@Payload() data: any) {
    await this.userIndexingService.update(data.id, data);
  }

  @EventPattern("user.deleted")
  async onUserDeleted(@Payload() data: any) {
    await this.userIndexingService.delete(data.id);
  }
}
