import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '../token/token.module';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { ImageLocalService } from '../imageLocal/imageLocal.service';
import { ImageLocalSchema } from 'src/schemas/imageLocal.schema';
import { BlogSchema } from 'src/schemas/blog.schema';
import { TasksService } from 'src/tasks/tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema}]),
    MongooseModule.forFeature([{ name: 'ImageLocal', schema: ImageLocalSchema }]),
    JwtModule,
    TokenModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, ImageLocalService, TasksService],
})
export class BlogModule {}
