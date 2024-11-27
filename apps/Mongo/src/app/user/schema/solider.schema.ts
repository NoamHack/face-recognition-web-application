import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SoliderDocument = Solider & Document;

@Schema()
export class Solider {
  @Prop()
  soliderFirstName: string;

  @Prop()
  soliderLastName: string;

  @Prop()
  soliderClassificationLevel: number;

  @Prop()
  soliderPersonalNumber: number;
}

export const SoliderSchema = SchemaFactory.createForClass(Solider);
