import { Module } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { SubCategoryService } from '../subCategory/SubCategory.service';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ImageSchema } from 'src/schemas/image.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'src/schemas/category.schema';
import { SubCategorySchema } from 'src/schemas/subCategory.schema';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { FeedbackSchema } from 'src/schemas/feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'SubCategory', schema: SubCategorySchema }]),
    JwtModule,
    TokenModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, CategoryService, SubCategoryService],
})
export class ImageModule {}
