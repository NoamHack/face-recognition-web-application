import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  userEmail: string;
  @IsNumber()
  @IsNotEmpty()
  userPassword: string;
  @IsString()
  @IsNotEmpty()
  userSalt: string;
}
