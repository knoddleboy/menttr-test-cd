import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @Length(8, 72)
  newPassword: string;
}
