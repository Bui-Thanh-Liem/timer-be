import {
  Body,
  Controller,
  Delete,
  Patch,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { UploadImages } from 'src/decorator/uploadImage.decorator';
import { Request } from 'express';
import { AQueries } from 'src/abstracts/AQuery.abstract';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateFeedbackDto,
  DeleteManyDto,
  UpdateFeedbackDto,
} from './feedback.dto';

@Controller('feedback')
@ApiTags('Feedback image')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Tạo một feedback image' })
  @UploadImages({
    images: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
    nameFeedback: {
      type: 'string',
      description: 'Name of the image',
    },
    description: {
      type: 'string',
      description: 'Description of the feedback',
    },
    subCategoryID: {
      type: 'string',
      description: 'Subcategory ID',
    },
  })
  async create(
    @Req() req: Request,
    @UploadedFiles() uploadedFiles: Array<Express.Multer.File>,
    @Body() dataCreateFeedback: CreateFeedbackDto,
  ) {
    const newFeedback = await this.feedbackService.create(
      req,
      dataCreateFeedback,
      uploadedFiles,
    );

    return new AResponseOk({
      message: 'Đã tạo ảnh phản hồi thành công',
      data: newFeedback,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lấy Feedback bằng id' })
  async findOneById(@Param('id') id: string) {
    const feedback = await this.feedbackService.findOneById(id);

    return new AResponseOk({
      message: 'Đã tìm thấy hình ảnh phản hồi thành công',
      data: feedback,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả feedback' })
  async findAll(@Query() queries: AQueries) {
    const feedbacks = await this.feedbackService.findAll(queries);

    return new AResponseOk({
      message: 'Lấy tất cả ảnh phản hồi thành công',
      data: feedbacks,
    });
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @UploadImages(
    {
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
      nameFeedback: {
        type: 'string',
        description: 'Name of the image',
      },
      description: {
        type: 'string',
        description: 'Description of the feedback',
      },
      subCategoryID: {
        type: 'string',
        description: 'Subcategory ID',
      },
    },
    'Cập nhật danh mục mới bằng id và dataForm',
  )
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dataUpdate: UpdateFeedbackDto,
    @UploadedFiles() uploadedFiles: Array<Express.Multer.File>,
  ) {
    const updateFeedback = await this.feedbackService.update(
      id,
      dataUpdate,
      uploadedFiles,
    );

    return new AResponseOk({
      message: 'Cập nhật ảnh phản hồi thành công',
      data: updateFeedback,
    });
  }

  @Get('/categoryID/:id')
  @ApiOperation({ summary: 'Lấy tất cả feedback theo CategoryID' })
  async findAllByCategoryID(
    @Param('id') id: string,
    @Query() queries: AQueries,
  ) {
    const feedbacks = await this.feedbackService.findAllByCategoryID(
      id,
      queries,
    );

    return new AResponseOk({
      message: 'Đã tìm thấy tất cả ảnh phản hồi theo danh mục chính thành công',
      data: feedbacks,
    });
  }

  @Delete('/soft')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa MỀM một hoặc nhiều feedback {ids: [...]}' })
  async softDeleteMany(@Body() DeleteMany: DeleteManyDto) {
    const deletedFeedback = await this.feedbackService.softDeleteMany(
      DeleteMany.ids,
    );

    return new AResponseOk({
      message: 'Đã xóa mềm ảnh phản hồi hình ảnh thành công',
      data: deletedFeedback,
    });
  }

  @Post('/restore')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Khôi phụ một hoặc nhiều feedback {ids: [...]}' })
  async restoreMany(@Body() restoreMany: DeleteManyDto) {
    const deletedFeedback = await this.feedbackService.restoreMany(
      restoreMany.ids,
    );

    return new AResponseOk({
      message: 'Khôi phục hình ảnh phản hồi thành công',
      data: deletedFeedback,
    });
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa một hoặt nhiều feedback {ids: [...]}' })
  async deleteMany(@Body() dataDeleteMany: DeleteManyDto) {
    const deletedFeedback = await this.feedbackService.deleteMany(
      dataDeleteMany.ids,
    );

    return new AResponseOk({
      message: 'Đã xóa ảnh phản hồi thành công',
      data: deletedFeedback,
    });
  }
}
