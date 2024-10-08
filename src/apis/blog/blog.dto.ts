import { ApiProperty } from '@nestjs/swagger';
import { IBlog, ITimer } from 'src/interfaces/models';
import { IsNotEmpty, Validate } from 'class-validator';
import { isEmpty } from 'src/validation/message.validation';

export class CreateBlogDto implements Partial<IBlog> {
  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('Title'),
  })
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: isEmpty('Content'),
  })
  content: string;

  @ApiProperty({
    default: {type: "NO", value: "0"}
  })
  timer: ITimer;
}

export class UpdateBlogDto implements Partial<IBlog> {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  content: string;
  
  @ApiProperty({ type: ITimer })
  timer?: ITimer;
  
  thumb?: string;
}

export class DeleteManyDto {
  @IsNotEmpty({ message: isEmpty('ids') })
  @ApiProperty()
  ids: Array<string>;
}
