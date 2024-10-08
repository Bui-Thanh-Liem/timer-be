import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AResponseOk } from 'src/abstracts/AResponse.abstract';
import { CookieHelper } from 'src/helpers/cookie.helper';
import { CONST_NAME_TOKEN } from 'src/constants/value.cont';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() dataLogin: LoginDto, @Res() res: Response) {
    const resultLogin = await this.authService.login(dataLogin);

    CookieHelper.setCookie({
      name: CONST_NAME_TOKEN,
      value: resultLogin.token,
      res,
    });

    res.status(200).json({
      message: 'Đăng nhập thành công',
      data: resultLogin,
      statusCode: 200,
    });
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  async register(@Body() dataRegister: RegisterDto) {
    const newUser = await this.authService.register(dataRegister);

    return new AResponseOk({
      message: 'Đăng kí thành công',
      data: newUser,
    });
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout' })
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req); // verify in AuthGuard => req['user']: dataUser

    // Clear cookies
    CookieHelper.clearCookie({ name: CONST_NAME_TOKEN, res });

    res.status(200).json({
      message: 'Đăng xuất thành công',
      statusCode: 200,
    });
  }

  @Get('/get-me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Me' })
  async getMe(@Req() req: Request) {
    const me = await this.authService.getMe(req);

    return new AResponseOk({
      message: 'Get me successfully',
      data: me,
    });
  }
}
