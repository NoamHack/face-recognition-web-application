import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SoliderPicsDto {
  @IsNumber()
  @IsNotEmpty()
  soliderPersonalNumber!: number;

  @IsString()
  @IsNotEmpty()
  soliderPositivePic1!: string;

  @IsString()
  @IsNotEmpty()
  soliderPositivePic2!: string;

  @IsString()
  @IsNotEmpty()
  soliderPositivePic3!: string;

  @IsString()
  @IsNotEmpty()
  soliderPositivePic4!: string;

  @IsString()
  @IsNotEmpty()
  soliderAnchorPic1!: string;

  @IsString()
  @IsNotEmpty()
  soliderAnchorPic2!: string;

  @IsString()
  @IsNotEmpty()
  soliderAnchorPic3!: string;

  @IsString()
  @IsNotEmpty()
  soliderAnchorPic4!: string;
}
