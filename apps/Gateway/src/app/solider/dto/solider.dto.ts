import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SoliderDto {
  @IsString()
  @IsNotEmpty()
  soliderFirstName: string | undefined;
  @IsString()
  @IsNotEmpty()
  soliderLastName: string | undefined;
  @IsNumber()
  @IsNotEmpty()
  soliderClassificationLevel: Number | undefined;
  @IsNumber()
  @IsNotEmpty()
  soliderPersonalNumber: Number | undefined;
}
