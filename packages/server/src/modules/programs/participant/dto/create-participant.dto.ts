import { IsString, Length } from "class-validator";

export class CreateParticipantDto {
  @IsString()
  @Length(1, 600)
  motivation: string;
}
