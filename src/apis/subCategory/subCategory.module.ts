import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategorySchema } from 'src/schemas/subCategory.schema';
import { SubCategoryService } from './SubCategory.service';
import { SubCategoryController } from './subCategory.controller';
import { CategoryModule } from '../category/category.module';
import { CategorySchema } from 'src/schemas/category.schema';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { FeedbackSchema } from 'src/schemas/feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SubCategory', schema: SubCategorySchema },
    ]), // Register the schema
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    CategoryModule,
    TokenModule,
    JwtModule,
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
