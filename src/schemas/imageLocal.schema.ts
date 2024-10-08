import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IImageLocal, IUser } from 'src/interfaces/models';
import { Base, BaseSchema } from './base.schema';

export type ImageLocalDocument = ImageLocal & Document;

@Schema({timestamps: true})
export class ImageLocal extends Base implements IImageLocal {

  @Prop({ required: true })
  url: string;

  @Prop({ required: true }) 
  alt: string;

  @Prop({ required: true }) 
  format: string;

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

export const ImageLocalSchema = SchemaFactory.createForClass(ImageLocal);
ImageLocalSchema.add(BaseSchema);