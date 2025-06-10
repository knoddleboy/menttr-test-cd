import { Type } from "class-transformer";
import {
  IsString,
  IsDate,
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsInt,
} from "class-validator";

export class ScheduleSessionDto {
  @IsInt()
  @IsNotEmpty()
  programId: number;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  agenda: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
