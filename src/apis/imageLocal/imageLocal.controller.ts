import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { UploadImages } from 'src/decorator/uploadImage.decorator';
import { DeleteOnrByUrlDto } from './imageLocal.dto';
import { ImageLocalService } from './imageLocal.service';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Image local')
@UseGuards(AuthGuard)
@Controller('/image-local')
export class ImageLocalController {
  constructor(private readonly imageLocalService: ImageLocalService) {}

  @Post()
  @ApiOperation({ summary: 'Create files image into local' })
  @UploadImages()
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const imageLocal = await this.imageLocalService.create(files);

    return res.status(StatusCodes.OK).json({
      message: 'Image uploaded successfully',
      data: imageLocal,
      statusCode: StatusCodes.OK,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get files image by url' })
  async findOneById(@Param('id') id: string) {
    const imageLocal = await this.imageLocalService.findOneById(id);

    return new AResponseOk({
      message: 'Image found successfully',
      data: imageLocal,
    });
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a file' })
  async removeFile(@Body() formData: DeleteOnrByUrlDto) {
    const resultDeleted = await this.imageLocalService.deleteOneByUrl(
      formData.url,
    );

    // Return
    return new AResponseOk({
      message: 'Remove file successfully',
      data: resultDeleted,
    });
  }
}
