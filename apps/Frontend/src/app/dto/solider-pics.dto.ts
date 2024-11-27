import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SoliderDto {
  @IsNumber()
  @IsNotEmpty()
  soliderPersonalNumber!: number;

  @IsString()
  @IsNotEmpty()
  soliderFrontPic!: string;

  @IsString()
  @IsNotEmpty()
  soliderLeftProfilePic!: string;

  @IsString()
  @IsNotEmpty()
  soliderRightProfilePic!: string;
}
