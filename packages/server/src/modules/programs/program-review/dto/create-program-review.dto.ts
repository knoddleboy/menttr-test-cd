import { IsInt, IsString, MaxLength } from "class-validator";

export class CreateProgramReviewDto {
  @IsInt()
  rating: number;

  @IsString()
  @MaxLength(2000)
  content: string;
}
