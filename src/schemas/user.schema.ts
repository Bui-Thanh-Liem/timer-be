import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from 'src/interfaces/models';
import { Base, BaseSchema } from './base.schema';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User extends Base implements IUser {
  
  @Prop({ required: true })
  account: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  roleEng: string;

  @Prop({ required: false, default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.add(BaseSchema);
