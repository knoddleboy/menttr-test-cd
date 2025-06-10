import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { Status } from "src/shared/enums/status.enum";

export class UpdateParticipantStatusDto {
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  reason?: string;
}
