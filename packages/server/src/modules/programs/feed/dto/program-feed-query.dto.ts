import { Transform } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";
import { base64DecodeArray } from "src/shared/libs/base64";

export class ProgramFeedQueryDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => base64DecodeArray(value), { toClassOnly: true })
  readonly cursor?: any[];
}
