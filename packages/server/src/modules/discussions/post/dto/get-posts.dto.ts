import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetPostsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cursor?: string;
}
