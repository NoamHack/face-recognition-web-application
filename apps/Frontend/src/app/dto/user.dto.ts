import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  userEmail: string | undefined;
  @IsString()
  @IsNotEmpty()
  userPassword: string | undefined;
  @IsString()
  @IsNotEmpty()
  userSalt: string | undefined;
}
