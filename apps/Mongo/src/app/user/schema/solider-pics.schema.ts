import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SoliderPicsDocument = SoliderPics & Document;

@Schema()
export class SoliderPics {
  @Prop({ type: mongoose.Schema.Types.Number, ref: 'Solider' })
  soliderPersonalNumber: number;

  @Prop()
  soliderFrontPic: string;

  @Prop()
  soliderLeftProfilePic: string;

  @Prop()
  soliderRightProfilePic: string;
}

export const SoliderPicsSchema = SchemaFactory.createForClass(SoliderPics);
