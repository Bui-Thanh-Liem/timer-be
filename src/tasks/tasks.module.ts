import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BlogService } from 'src/apis/blog/blog.service';
import { BlogSchema } from 'src/schemas/blog.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }])],
  providers: [TasksService, BlogService],
})
export class TasksModule {}
