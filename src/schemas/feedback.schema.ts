import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICategory, IFeedBack, ISubCategory, IUser } from 'src/interfaces/models';
import { Base, BaseSchema } from './base.schema';

export type FeedbackDocument = Feedback & Document;

@Schema({timestamps: true})
export class Feedback extends Base implements IFeedBack {

  @Prop({ required: true })
  nameFeedback: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'SubCategory', required: false })
  subCategory: Partial<ISubCategory>;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  category: Partial<ICategory>;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  deletedBy: IUser | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy: IUser | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updatedBy: IUser | Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
FeedbackSchema.add(BaseSchema);
