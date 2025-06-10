import { IsEmail, IsString, Length } from "class-validator";

export class SignupDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(4, 32)
  readonly username: string;

  @IsString()
  @Length(8, 72)
  readonly password: string;
}
