import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, DeleteManyDto, UpdateUserDto } from './user.dto';
import { Request } from 'express';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorator/role.decorator';

@Controller('/user')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const newUSer = await this.userService.create(createUserDto);

    //
    return new AResponseOk({
      message: 'Đã tạo người dùng thành công',
      data: newUSer,
    });
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Cập nhật người dùng bằng id và dataForm' })
  async updateById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const resultUpdate = await this.userService.updateById(id, updateUserDto);

    return new AResponseOk({
      message: 'Đã cập nhật người dùng thành công',
      data: resultUpdate,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lấy user bằng id' })
  async findOneById(@Param('id') id: string) {
    const user = await this.userService.findOneById(id);
    return new AResponseOk({
      message: 'Nhận người dùng thành công',
      data: user,
    });
  }

  //
  @Get()
  @ApiOperation({ summary: 'Lấy tất cả người dùng' })
  async getAll() {
    const users = await this.userService.findAll();

    return new AResponseOk({
      message: 'Lấy tất cả người dùng thành công',
      data: users,
    });
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa user bằng id' })
  async deleteOneById(@Param('id') id: string) {
    await this.userService.deleteOneById(id);
    return new AResponseOk({
      message: 'Xóa người dùng thành công',
      data: null,
    });
  }

  @Delete()
  @Roles('admin')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Xóa nhiều user bằng ids' })
  async deleteManyByIds(@Body() dataBody: DeleteManyDto) {
    await this.userService.deleteManyByIds(dataBody.ids);

    return new AResponseOk({
      message: 'Xóa người dùng thành công',
      data: null,
    });
  }
}
