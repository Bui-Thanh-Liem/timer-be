import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { MAX_LENGTH, MIN_LENGTH } from 'src/constants/value.cont';
import { IUser } from 'src/interfaces/models';
import { isEmpty, minLength } from 'src/validation/message.validation';

export class CreateUserDto {
  //
  @ApiProperty({ type: String, default: 'user1' })
  @MinLength(MIN_LENGTH, {
    message: minLength('Tên đăng nhập', MIN_LENGTH),
  })
  @MaxLength(MAX_LENGTH, {
    message: minLength('Tên đăng nhập', MAX_LENGTH),
  })
  @IsNotEmpty({
    message: isEmpty('Tên đăng nhập'),
  })
  account: string;

  //
  @ApiProperty({ type: String, default: 'user1@' })
  @IsNotEmpty({
    message: isEmpty('Mật khẩu'),
  })
  password: string;

  //
  @ApiProperty({ type: String, default: 'user' })
  @IsNotEmpty({
    message: isEmpty('Vai trò'),
  })
  role: string;

  @ApiProperty({ type: String, default: 'user' })
  @IsNotEmpty({
    message: isEmpty('Vai trò english'),
  })
  roleEng: string;
}

export class UpdateUserDto implements Partial<IUser> {
  //
  @ApiProperty({ type: String, default: '' })
  @MinLength(MIN_LENGTH, {
    message: minLength('Tên đăng nhập', MIN_LENGTH),
  })
  @MaxLength(MAX_LENGTH, {
    message: minLength('Tên đăng nhập', MAX_LENGTH),
  })
  @IsNotEmpty({
    message: isEmpty('Tên đăng nhập'),
  })
  account: string;

  //
  @ApiProperty({ type: String, default: 'user' })
  @IsNotEmpty({
    message: isEmpty('Vai trò'),
  })
  role: string;

  @ApiProperty({ type: String, default: 'user' })
  @IsNotEmpty({
    message: isEmpty('Vai trò english'),
  })
  roleEng: string;
}

export class DeleteManyDto {
  @IsNotEmpty({ message: isEmpty('ids') })
  @ApiProperty()
  ids: Array<string>;
}
