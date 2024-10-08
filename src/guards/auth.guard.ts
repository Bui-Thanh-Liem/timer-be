import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotAcceptableException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/apis/token/token.service';
import { TokenHelper } from 'src/helpers/token.helper';
import { Request } from 'express';
import { CONST_NAME_TOKEN } from 'src/constants/value.cont';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.[`${CONST_NAME_TOKEN}`];

    //
    if (!token) {
      throw new NotAcceptableException('Vui lòng đăng nhập lại');
    }

    const tokenInDataBase = await this.tokenService.findTokeByCode(token);

    //
    try {
      const payload = await TokenHelper.verifyToken({
        token,
        publicKey: tokenInDataBase.token_secretKey,
        jwtService: this.jwtService,
      });

      request[`${CONST_NAME_TOKEN}`] = payload;
      return true;
    } catch (error) {
      throw new ForbiddenException(
        'Vui lòng đăng nhập lại',
      );
    }
  }
}
