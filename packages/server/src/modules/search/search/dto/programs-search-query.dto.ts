import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { transformToStringArray } from "../../search.util";

export class ProgramsSearchQueryDto {
  @IsOptional()
  @IsString()
  readonly query?: string;

  @IsOptional()
  @IsString()
  readonly type?: string;

  @IsOptional()
  @IsDateString()
  readonly start_date?: string;

  @IsOptional()
  @IsDateString()
  readonly end_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly max_participants?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: string }) => value.split(","))
  readonly skills?: string[];

  @IsOptional()
  @IsArray()
  @Transform(transformToStringArray)
  readonly cursor?: any[];
}
