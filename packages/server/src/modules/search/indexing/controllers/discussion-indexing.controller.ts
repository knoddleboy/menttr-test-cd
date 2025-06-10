import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { DiscussionIndexingService } from "../services/discussion-indexing.service";

@Controller()
export class DiscussionIndexingController {
  constructor(
    private readonly discussionIndexingService: DiscussionIndexingService,
  ) {}

  @EventPattern("discussion.created")
  async onProgramCreated(@Payload() data: any) {
    await this.discussionIndexingService.index(data.id, data);
  }

  @EventPattern("discussion.updated")
  async onProgramUpdated(@Payload() data: any) {
    await this.discussionIndexingService.update(data.id, data);
  }
}
