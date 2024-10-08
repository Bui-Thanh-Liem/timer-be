import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { MAX_LENGTH, MIN_LENGTH } from "src/constants/value.cont";
import { IUser } from "src/interfaces/models";
import { isEmpty, minLength } from "src/validation/message.validation";

export class LoginDto implements Partial<IUser> {
    @ApiProperty({type: String, default: "seadragontechnology"})
    @IsNotEmpty({message: isEmpty('Tên đăng nhập')})
    account?: string;
    
    @ApiProperty({type: String, default: "Admin123@"})
    @IsNotEmpty({message: isEmpty('Mật khẩu')})
    password?: string;
}

export class RegisterDto implements Partial<IUser> {
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
        @ApiProperty({ type: String, default: '' })
        @IsNotEmpty({
          message: isEmpty('Mật khẩu'),
        })
        password: string;
}