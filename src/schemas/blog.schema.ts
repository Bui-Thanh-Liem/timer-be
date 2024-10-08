import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IBlog,
  ICategory,
  IFeedBack,
  ISubCategory,
  ITimer,
  IUser,
} from 'src/interfaces/models';
import { Base, BaseSchema } from './base.schema';
import { ETimer } from 'src/enums/common.enum';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog extends Base implements IBlog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  thumb: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timer: ITimer;

  @Prop({ required: true })
  schedule: ETimer;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy: IUser | Types.ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.add(BaseSchema);
