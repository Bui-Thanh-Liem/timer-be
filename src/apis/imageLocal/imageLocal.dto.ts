import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { isEmpty } from 'src/validation/message.validation';

export class ImageLocalDto {
  @ApiProperty({ type: String })
  alt: string;

  @ApiProperty({ type: String })
  format: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: isEmpty('Url of image') })
  url: string;

  @ApiProperty({ type: Number })
  heigh: number;

  @ApiProperty({ type: Number })
  size: number;

  @ApiProperty({ type: Number })
  width: number;
}


export class DeleteManyDto {
  @IsNotEmpty({ message: isEmpty('ids') })
  @ApiProperty()
  ids: Array<string>;
}

export class DeleteOnrByUrlDto {
  @IsNotEmpty({ message: isEmpty('Url') })
  @ApiProperty()
  url: string;
}