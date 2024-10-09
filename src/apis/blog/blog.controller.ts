import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { UploadImages } from 'src/decorator/uploadImage.decorator';
import { Request } from 'express';
import {
  CreateBlogDto, UpdateBlogDto,
} from './blog.dto';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('blog')
@ApiTags('blog')
export class BlogController {
  constructor(private blogService: BlogService, private taskService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một blog' })
  @UploadImages({
    thumb: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
    title: {
      type: 'string',
      description: 'title of the blog',
    },
    content: {
      type: 'string',
      description: 'content of the blog',
    },
    timer: {
      type: 'object',
      description: 'Timer',
      default: {
        date: "08-01-2000",
        time: "19:40"
      }
    },
  })
  async create(
    @Req() req: Request,
    @UploadedFiles() uploadedFiles: Array<Express.Multer.File>,
    @Body() dataCreateBlog: CreateBlogDto,
  ) {
    const newFeedback = await this.blogService.create(
      req,
      dataCreateBlog,
      uploadedFiles,
    );
    this.taskService.createCronJob(newFeedback);

    return new AResponseOk({
      message: 'Đã tạo ảnh phản hồi thành công',
      data: newFeedback,
    });
  }

  @Patch('/:id')
  @UploadImages({
    thumb: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
    title: {
      type: 'string',
      description: 'title of the blog',
    },
    content: {
      type: 'string',
      description: 'content of the blog',
    },
    timer: {
      type: 'object',
      description: 'Timer',
      default: {
        date: "08-01-2000",
        time: "19:40"
      }
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dataUpdate: UpdateBlogDto,
    @UploadedFiles() uploadedFiles: Array<Express.Multer.File>,
  ) {
    const updateFeedback = await this.blogService.update(
      id,
      dataUpdate,
      uploadedFiles,
    );
    this.taskService.updateCronTime(updateFeedback);

    return new AResponseOk({
      message: 'Cập nhật blog thành công',
      data: updateFeedback,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả blogs' })
  async findAll() {
    const feedbacks = await this.blogService.findAll();

    return new AResponseOk({
      message: 'Lấy tất cả blogs thành công',
      data: feedbacks,
    });
  }
}
