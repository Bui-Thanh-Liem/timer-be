import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Validate } from 'class-validator';
import { MAX_LENGTH, MIN_LENGTH } from 'src/constants/value.cont';
import { ISubCategory } from 'src/interfaces/models';
import { isEmpty, maxLength, minLength } from 'src/validation/message.validation';
import { IsObjectId } from 'src/validation/objectId.validation';

const name: string = 'SubCategory name';
export class CreateSubCategoryDto implements Partial<ISubCategory> {
  @ApiProperty({ type: String, default: 'Hút mở tay' })
  @MinLength(MIN_LENGTH, {
    message: minLength(name, MIN_LENGTH),
  })
  @MaxLength(MAX_LENGTH, {
    message: maxLength(name, MAX_LENGTH),
  })
  @IsNotEmpty({
    message: isEmpty(name),
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: isEmpty('Danh mục'),
  })
  // @Validate(IsObjectId, {
  //   message: 'Invalid ObjectId, must be a 24 character hex string',
  // })
  categoryID?: string;
}

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}

export class DeleteManyDto {
  @IsNotEmpty({ message: isEmpty('ids') })
  @ApiProperty()
  ids: Array<string>;
}
