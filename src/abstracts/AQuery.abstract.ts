import { ApiProperty } from '@nestjs/swagger';
import { IQueries } from 'src/interfaces/common';

export abstract class AQueries implements IQueries {
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 100,
    title: 'Limit',
    default: 20,
    description: 'Giới hạn item trong một trang',
  })
  limit: string;

  @ApiProperty({
    type: String,
    minimum: 1,
    title: 'Page',
    format: 'int32',
    default: 1,
    description: 'Hiển thị trang hiện tại',
  })
  page: string;

  @ApiProperty({
    type: Boolean,
    title: 'Is deleted',
    description: 'Tìm kiếm trường soft delete',
    default: false,
    required: false,
  })
  isDeleted: boolean;
}
