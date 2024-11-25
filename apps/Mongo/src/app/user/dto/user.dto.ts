import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  userEmail: string;
  @IsString()
  @IsNotEmpty()
  userPassword: number;
  @IsString()
  @IsNotEmpty()
  userSalt: string;
}
