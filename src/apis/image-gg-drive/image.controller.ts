import {
  Controller,
  Req,
  Post,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Get,
  Param,
  Delete,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { DeleteManyDto } from './image.dto';
import { UploadImages } from 'src/decorator/uploadImage.decorator';
import { AQueries } from 'src/abstracts/AQuery.abstract';


@Controller('image')
@UseGuards(AuthGuard)
@ApiTags('Image google drive')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post()
  @UploadImages()
  async create(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('files:::', files);

    if (files.length === 0) {
      throw new BadRequestException('Please select a photo to upload');
    }

    const newImage = await this.imageService.create(req, files);

    return new AResponseOk({
      message: 'Image created successfully',
      data: newImage,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lấy ảnh theo id' })
  async findOneById(@Param('id') id: string) {
    const img = await this.imageService.findOneById(id);
    return new AResponseOk({
      message: 'Found image successfully',
      data: img,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả ảnh' })
  async findAll(@Query() queries: AQueries) {
    const images = await this.imageService.findAll(queries);
    return new AResponseOk({
      message: 'Found all images successfully',
      data: images,
    });
  }

  @Patch()
  @ApiOperation({summary: "Xóa MỀM một hoặc nhiều ảnh {ids: [...]}"})
  async softDeleteMany(@Body() softDataDeleteManyDto: DeleteManyDto) {
    const softDeleteMany = await this.imageService.softDeleteMany(softDataDeleteManyDto.ids);
    return new AResponseOk({
      message: 'Soft deleteMany successfully',
      data: softDeleteMany,
    })
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa một hoặt nhiều ảnh {ids: [...]}' })
  async deleteMany(@Body() dataDeleteManyDto: DeleteManyDto) {
    const deletedImages = await this.imageService.deleteMany(
      dataDeleteManyDto.ids,
    );

    return new AResponseOk({
      message: 'Deleted images successfully',
      data: deletedImages,
    })
  }
}
