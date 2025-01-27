import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SoliderPicsDocument = SoliderPics & Document;

@Schema()
export class SoliderPics {
  @Prop({ type: mongoose.Schema.Types.Number, ref: 'Solider' })
  soliderPersonalNumber: number;

  @Prop()
  soliderPositivePic1: string;

  @Prop()
  soliderPositivePic2: string;

  @Prop()
  soliderPositivePic3: string;

  @Prop()
  soliderPositivePic4: string;

  @Prop()
  soliderAnchorPic1: string;

  @Prop()
  soliderAnchorPic2: string;

  @Prop()
  soliderAnchorPic3: string;

  @Prop()
  soliderAnchorPic4: string;
}

export const SoliderPicsSchema = SchemaFactory.createForClass(SoliderPics);
