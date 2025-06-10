import { Transform } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";
// import { transformToStringArray } from "../../search.util";

export class FeedQueryDto {
  @IsOptional()
  @IsArray()
  // @Transform(transformToStringArray)
  readonly cursor?: any[];
}
