import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from 'src/schemas/feedback.schema';
import { TokenModule } from '../token/token.module';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { ImageLocalService } from '../imageLocal/imageLocal.service';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { CategoryModule } from '../category/category.module';
import { ImageLocalSchema } from 'src/schemas/imageLocal.schema';
import { SubCategorySchema } from 'src/schemas/subCategory.schema';
import { CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    MongooseModule.forFeature([{ name: 'ImageLocal', schema: ImageLocalSchema }]),
    MongooseModule.forFeature([{ name: 'SubCategory', schema: SubCategorySchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    JwtModule,
    TokenModule,
    SubCategoryModule,
    CategoryModule
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, ImageLocalService],
})
export class FeedbackModule {}
