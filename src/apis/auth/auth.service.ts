import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/interfaces/models';
import { LoginDto, RegisterDto } from './auth.dto';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { IResponseLogin } from 'src/interfaces/response';
import { CONST_NAME_TOKEN } from 'src/constants/value.cont';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModal: Model<IUser>,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  //
  async login(dataLogin: LoginDto): Promise<IResponseLogin<Partial<IUser>>> {
    try {
      const userInDateBase = await this.userModal.findOne({
        account: dataLogin.account,
      });

      if (!userInDateBase) {
        throw new BadRequestException('Người dùng không tồn tại!, vui lòng thử lại');
      }

      const isPassword = await bcrypt.compare(
        dataLogin.password,
        userInDateBase.password,
      );
      if (!isPassword) {
        throw new BadRequestException('Tên người dùng hoặc mật khẩu sai');
      }

      const { token, user } =
        await this.tokenService.createToken(userInDateBase);
      return {
        user: user,
        token: token,
      };
    } catch (error) {
      throw error;
    }
  }

  //
  async logout(req: Request): Promise<boolean> {
    try {
      const me = await this.getMe(req);

      if (!me) {
        throw new BadRequestException('Đăng xuất thất bại');
      }

      //
      console.log('me._id.toString()::', me._id.toString());
      const deletedToken = await this.tokenService.deleteTokenByUserId(
        me._id.toString(),
      );
      console.log('deletedToken::::', deletedToken);
      if (!deletedToken) {
        throw new BadRequestException('Đăng xuất thất bại');
      }

      //
      req['user'] = null;
      return true;
    } catch (error) {
      throw error;
    }
  }

  //
  async register(dataRegister: RegisterDto): Promise<IUser> {
    try {
      const userInDateBase = await this.userModal.findOne({
        account: dataRegister.account,
      });

      if (userInDateBase) {
        throw new BadRequestException('Tên người dùng đã tồn tại');
      }

      const register = {
        ...dataRegister,
        roleEng: 'user',
        role: 'user',
      };

      const resultRegister = await this.userService.create(register)
      return resultRegister;
    } catch (error) {
      throw error;
    }
  }

  //
  async getMe(req: Request) {
    try {
      const dataUser = await req[`${CONST_NAME_TOKEN}`];

      //
      const user = await this.userModal.findById(dataUser._id);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
