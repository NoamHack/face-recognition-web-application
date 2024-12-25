import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SoliderPicsDto {
  @IsNumber()
  @IsNotEmpty()
  soliderPersonalNumber!: number;

  @IsString()
  @IsNotEmpty()
  soliderFrontPic1!: string;

  @IsString()
  @IsNotEmpty()
  soliderFrontPic2!: string;

  @IsString()
  @IsNotEmpty()
  soliderFrontPic3!: string;

  @IsString()
  @IsNotEmpty()
  soliderFrontPic4!: string;
}
