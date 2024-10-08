import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'src/schemas/category.schema';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { SubCategorySchema } from 'src/schemas/subCategory.schema';
import { FeedbackSchema } from 'src/schemas/feedback.schema';
import { FeedbackModule } from '../feedbackImage/feedback.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]), // Register the schema
    MongooseModule.forFeature([{ name: 'SubCategory', schema: SubCategorySchema }]),
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    TokenModule,
    JwtModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
