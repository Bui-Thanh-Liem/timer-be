import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICategory } from 'src/interfaces/models';
import { Base, BaseSchema } from './base.schema';

export type CategoryDocument = Category & Document;

@Schema({timestamps: true})
export class Category extends Base implements ICategory {
  
  @Prop({ required: true }) 
  name: string;

  @Prop({ required: true }) 
  subCategoriesID: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.add(BaseSchema);