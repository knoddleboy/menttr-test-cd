import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly identifier: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
