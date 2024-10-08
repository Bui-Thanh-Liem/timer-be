import { ApiProperty } from '@nestjs/swagger';
import { IImage } from 'src/interfaces/models';
import { IsNotEmpty } from 'class-validator';
import { isEmpty } from 'src/validation/message.validation';

export class CreateImageDto implements Partial<IImage> {
  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('Format string image'),
  })
  format: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('Public key'),
  })
  key: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty({
    message: isEmpty('image size'),
  })
  size: number;

  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('path'),
  })
  url: string;
}

export class DeleteManyDto {
  @IsNotEmpty({ message: isEmpty('ids') })
  @ApiProperty()
  ids: Array<string>;
}