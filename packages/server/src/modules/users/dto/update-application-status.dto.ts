import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Status } from "src/shared/enums/status.enum";

export class UpdateApplicationStatusDto {
  @IsEnum(Status)
  status: Status;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
