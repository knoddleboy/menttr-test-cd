import { IsString, Length } from "class-validator";

export class ConvertMentorDto {
  @IsString()
  @Length(100, 600)
  motivation: string;
}
