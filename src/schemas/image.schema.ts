import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IImage, IUser } from 'src/interfaces/models';
import { Base, BaseSchema } from './base.schema';

export type ImageDocument = Image & Document;

@Schema({timestamps: true})
export class Image extends Base implements IImage {

  @Prop({ required: true })
  url: string;

  @Prop({ required: true }) 
  alt: string;

  @Prop({ required: true }) 
  format: string;

  @Prop({ required: true }) 
  key: string;

  @Prop({ required: true }) 
  size: number;

  @Prop({ required: true }) 
  width: number;

  @Prop({ required: true }) 
  heigh: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  deletedBy: IUser | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy: IUser | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updatedBy: IUser | Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
ImageSchema.add(BaseSchema);