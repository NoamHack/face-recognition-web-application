import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SoliderDto {
  @IsString()
  @IsNotEmpty()
  soliderFirstName!: string;

  @IsString()
  @IsNotEmpty()
  soliderLastName!: string;

  @IsNumber()
  @IsNotEmpty()
  soliderClassificationLevel!: number;

  @IsNumber()
  @IsNotEmpty()
  soliderPersonalNumber!: number;
}
