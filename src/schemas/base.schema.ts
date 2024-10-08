import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBaseModel } from 'src/interfaces/models';

export type BaseDocument = Base & Document;

@Schema()
export class Base implements IBaseModel {
  _id: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const BaseSchema = SchemaFactory.createForClass(Base);
