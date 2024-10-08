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
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateCategoryDto,
  DeleteManyDto,
  UpdateCategoryDto,
} from './category.dto';
import { Request } from 'express';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { AuthGuard } from 'src/guards/auth.guard';
import { AQueries } from 'src/abstracts/AQuery.abstract';

@Controller('/category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    const newCategory = await this.categoryService.create(createCategoryDto);

    //
    return new AResponseOk({
      message: 'Đã tạo danh mục thành công',
      data: newCategory,
    });
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cập nhật danh mục mới bằng id và dataForm' })
  async updateById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const resultUpdate = await this.categoryService.updateById(
      id,
      updateCategoryDto,
    );

    return new AResponseOk({
      message: 'Đã cập nhật danh mục thành công',
      data: resultUpdate,
    });
  }

  @Get('/data-selections')
  @ApiOperation({ summary: 'Lấy dữ liệu cho selection' })
  async getDataSelection() {
    const dataSelection = await this.categoryService.getDataSelection();

    return new AResponseOk({
      message: 'Lấy dữ liệu của selection thành công',
      data: dataSelection,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lấy danh mục bằng id' })
  async findOneById(@Param('id') id: string) {
    const category = await this.categoryService.findOneById(id);
    return new AResponseOk({
      message: 'Đã tìm thấy danh mục thành công',
      data: category,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh mục' })
  async getAll(@Query() queries: AQueries) {
    const categories = await this.categoryService.findAll(queries);

    return new AResponseOk({
      message: 'Lấy tất cả danh mục thành công',
      data: categories,
    });
  }

  @Post('/restore')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Khôi phụ c một hoặc nhiều category {ids: [...]}' })
  async restoreMany(@Body() restoreMany: DeleteManyDto) {
    const deletedCategory = await this.categoryService.restoreMany(
      restoreMany.ids,
    );

    return new AResponseOk({
      message: 'Khôi phục danh mục thành công',
      data: deletedCategory,
    });
  }

  @Delete('/soft')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa MỀM một hoặc nhiều category {ids: [...]}' })
  async softDeleteMany(@Body() DeleteMany: DeleteManyDto) {
    const deletedCategory = await this.categoryService.softDeleteMany(
      DeleteMany.ids,
    );

    return new AResponseOk({
      message: 'Xóa mềm danh mục thành công',
      data: deletedCategory,
    });
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa một hoặc nhiều danh mục bằng ids' })
  async deleteManyByIds(@Body() dataBody: DeleteManyDto) {
    await this.categoryService.deleteMany(dataBody.ids);

    return new AResponseOk({
      message: 'Xóa vĩnh viễn danh mục thành công',
      data: null,
    });
  }
}
