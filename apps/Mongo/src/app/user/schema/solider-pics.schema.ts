import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SoliderPicsDocument = SoliderPics & Document;

@Schema()
export class SoliderPics {

  @Prop()
  soliderPersonalNumber: number;

  @Prop()
  soliderFrontPic: string;

  @Prop()
  soliderLeftProfilePic: string;

  @Prop()
  soliderRightProfilePic: string;
}

export const SoliderPicsSchema = SchemaFactory.createForClass(SoliderPics);
