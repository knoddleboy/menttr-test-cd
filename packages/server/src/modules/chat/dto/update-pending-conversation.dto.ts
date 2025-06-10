import { IsEnum } from "class-validator";
import { Status } from "src/shared/enums/status.enum";

export class UpdatePendingConversationDto {
  @IsEnum(Status)
  status: Status;
}
