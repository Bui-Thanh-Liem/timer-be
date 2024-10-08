import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsMongoId } from 'class-validator';
import { MAX_LENGTH, MIN_LENGTH } from 'src/constants/value.cont';
import { ICategory } from 'src/interfaces/models';
import { isEmpty, minLength } from 'src/validation/message.validation';

export class CreateCategoryDto implements Partial<ICategory> {
  @ApiProperty({
    type: String,
    default: 'Hút mở',
  })
  @MinLength(MIN_LENGTH, {
    message: minLength('Category', MIN_LENGTH),
  })
  @MaxLength(MAX_LENGTH, {
    message: minLength('Category', MAX_LENGTH),
  })
  @IsNotEmpty({
    message: isEmpty('Category'),
  })
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty()
  subCategoriesID?: Array<string>;
}

export class DeleteManyDto {
  @IsNotEmpty({ message: isEmpty('ids') })
  @ApiProperty()
  ids: Array<string>;
}
