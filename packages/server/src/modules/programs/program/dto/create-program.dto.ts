import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { ProgramType } from "../../enums/program-type.enum";

export class CreateProgramDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsEnum(ProgramType)
  type: ProgramType;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsInt()
  @Min(1)
  maxParticipants: number;

  // @IsOptional()
  // @IsString()
  // @MaxLength(200)
  // meetingLink?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  skillIds?: number[];
}
