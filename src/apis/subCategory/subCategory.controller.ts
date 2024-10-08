import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubCategoryService } from './SubCategory.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateSubCategoryDto,
  DeleteManyDto,
  UpdateSubCategoryDto,
} from './subCategory.dto';
import { Request } from 'express';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { AuthGuard } from 'src/guards/auth.guard';
import { AQueries } from 'src/abstracts/AQuery.abstract';

@Controller('/sub-category')
@ApiTags('SubCategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Tạo danh phụ mới' })
  async create(
    @Body() createSubCategoryDto: CreateSubCategoryDto,
    @Req() req: Request,
  ) {
    const newSubCategory =
      await this.subCategoryService.create(createSubCategoryDto);

    //
    return new AResponseOk({
      message: 'Đã tạo Danh mục phụ  thành công',
      data: newSubCategory,
    });
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cập nhật danh mục phụ  mới bằng id và dataForm' })
  async updateById(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    const resultUpdate = await this.subCategoryService.updateById(
      id,
      updateSubCategoryDto,
    );

    return new AResponseOk({
      message: 'Đã cập nhật Danh mục phụ  thành công',
      data: resultUpdate,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lấy danh mục phụ  bằng id' })
  async findOneById(@Param('id') id: string) {
    const subCategory = await this.subCategoryService.findOneById(id);
    return new AResponseOk({
      message: 'Lấy danh mục thành công',
      data: subCategory,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh mục phụ' })
  async getAll(@Query() queries: AQueries) {
    const subCategories = await this.subCategoryService.findAll(queries);

    return new AResponseOk({
      message: 'Lấy tất cả danh mục thành công',
      data: subCategories,
    });
  }

  @Get('/categoryID/:id')
  @ApiOperation({ summary: 'Lấy tất cả danh phụ bằng id danh mục chính' })
  async getAllByCategoryId(@Param('id') id: string) {
    const subCategories = await this.subCategoryService.findAllByCategoryId(id);

    return new AResponseOk({
      message: 'Lấy tất cả danh phụ thành công',
      data: subCategories,
    });
  }

  @Post('/restore')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Khôi phụ c một hoặc nhiều subCategory {ids: [...]}',
  })
  async restoreMany(@Body() restoreMany: DeleteManyDto) {
    const deletedSubCategory = await this.subCategoryService.restoreMany(
      restoreMany.ids,
    );

    return new AResponseOk({
      message: 'Khôi phụ c danh mục thành công',
      data: deletedSubCategory,
    });
  }

  @Delete('/soft')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa MỀM một hoặc nhiều subCategory {ids: [...]}' })
  async softDeleteMany(@Body() DeleteMany: DeleteManyDto) {
    const deletedSubCategory = await this.subCategoryService.softDeleteMany(
      DeleteMany.ids,
    );

    return new AResponseOk({
      message: 'Xóa tạm thời danh mục thành công',
      data: deletedSubCategory,
    });
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa nhiều danh phụ bằng ids' })
  async deleteManyByIds(@Body() dataBody: DeleteManyDto) {
    await this.subCategoryService.deleteManyByIds(dataBody.ids);

    return new AResponseOk({
      message: 'Xóa vĩnh viễn danh mục thành công',
      data: null,
    });
  }
}
