import { ApiProperty } from '@nestjs/swagger';
import { IFeedBack } from 'src/interfaces/models';
import { IsNotEmpty, Validate } from 'class-validator';
import { isEmpty } from 'src/validation/message.validation';
import { IsObjectId } from 'src/validation/objectId.validation';

export class CreateFeedbackDto implements Partial<IFeedBack> {
  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('Tên ảnh phản hồi'),
  })
  nameFeedback: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('Miêu tả ảnh phản hồi'),
  })
  description: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('SubCategory'),
  })
  @Validate(IsObjectId, {
    message: 'Định dạng ObjectId không hợp lệ, phải là chuỗi hex 24 ký tự',
  })
  subCategoryID: string;
}

export class UpdateFeedbackDto implements Partial<IFeedBack> {
  @ApiProperty({ type: String })
  nameFeedback: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  @Validate(IsObjectId, {
    message: 'Định dạng ObjectId không hợp lệ, phải là chuỗi hex 24 ký tự',
  })
  subCategoryID: string;

  url?: string;
}

export class DeleteManyDto {
  @IsNotEmpty({ message: isEmpty('ids') })
  @ApiProperty()
  ids: Array<string>;
}
