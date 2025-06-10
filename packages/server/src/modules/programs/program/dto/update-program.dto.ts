import { PartialType } from "@nestjs/mapped-types";
import { CreateProgramDto } from "./create-program.dto";
import { IsEnum, IsOptional } from "class-validator";
import { ProgramStatus } from "../../enums/program-status.enum";

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
  @IsOptional()
  @IsEnum(ProgramStatus)
  status?: ProgramStatus;
}
