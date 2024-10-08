import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ISubCategory } from 'src/interfaces/models';
import { Base, BaseSchema } from './base.schema';

export type SubCategoryDocument = SubCategory & Document;

@Schema({timestamps: true})
export class SubCategory extends Base implements ISubCategory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  categoryID: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
SubCategorySchema.add(BaseSchema);