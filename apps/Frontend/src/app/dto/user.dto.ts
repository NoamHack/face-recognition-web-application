import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  userEmail: string | undefined;
  @IsNumber()
  @IsNotEmpty()
  userPassword: string | undefined;
  @IsString()
  @IsNotEmpty()
  userSalt: string | undefined;
}
