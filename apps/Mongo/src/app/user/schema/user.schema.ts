import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop()
  userEmail: string;

  @Prop()
  userPassword: string;

  @Prop()
  userSalt: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
