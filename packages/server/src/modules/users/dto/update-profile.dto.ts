import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  Length,
  IsArray,
  IsInt,
  IsNotEmpty,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(4, 32)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(1, 600)
  bio?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profileImageUrl?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  skillIds?: number[];
}
