import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SoliderPicsDocument = SoliderPics & Document;

@Schema()
export class SoliderPics {
  @Prop({ type: mongoose.Schema.Types.Number, ref: 'Solider' })
  soliderPersonalNumber: number;

  @Prop()
  soliderFrontPic1: string;

  @Prop()
  soliderFrontPic2: string;

  @Prop()
  soliderFrontPic3: string;

  @Prop()
  soliderFrontPic4: string;
}

export const SoliderPicsSchema = SchemaFactory.createForClass(SoliderPics);
