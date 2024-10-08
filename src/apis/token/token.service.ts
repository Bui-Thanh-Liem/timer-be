import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenHelper } from 'src/helpers/token.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IToken } from 'src/interfaces/models';
import { IUser } from 'src/interfaces/models';
import e from 'express';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('Token')
    private tokenModel: Model<IToken>,
  ) {}

  async createToken(user: IUser) {
    try {
      const payload: Partial<IUser> = {
        _id: user._id,
        account: user.account,
        role: user.role,
        roleEng: user.roleEng,
      };

      // Tạo key
      const { privateKey, publicKey } = TokenHelper.generateKeyPair();

      // Tạo token
      const createToken = await TokenHelper.createToken({
        privateKey,
        payload,
        jwtService: this.jwtService,
      });

      //
      const dataToken = {
        token_code: createToken,
        token_secretKey: publicKey,
        token_user: user._id,
      };

      const findToken = await this.findTokenByUser(user);

      if (findToken.length <= 0) {
        // Lưu token mới vào database
        const token = new this.tokenModel(dataToken);
        const newToken = await token.save();

        if (!newToken) {
          throw new BadRequestException('Login failed');
        }
      } else {
        // Cập nhật token cũ
        const updateToken = await this.tokenModel.findOneAndUpdate(
          { token_user: findToken[0].token_user },
          dataToken,
        );
        if (!updateToken) {
          throw new BadRequestException('Login failed');
        }
      }

      return { token: createToken, user: payload };
    } catch (error) {
      throw error;
    }
  }

  async findTokenByUser(user: IUser) {
    try {
      return await this.tokenModel.find({ token_user: user._id }).exec();
    } catch (error) {
      throw error;
    }
  }

  async findTokeByCode(code: string) {
    try {
      return await this.tokenModel.findOne({ token_code: code });
    } catch (error) {
      throw error;
    }
  }

  async deleteTokenToId(id: string) {
    try {
      return await this.tokenModel.findByIdAndDelete({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  async deleteTokenByUserId(userId: string): Promise<any> {
    try {
      return await this.tokenModel.deleteOne({ token_user: userId });
    } catch (error) {
      throw error;
    }
  }
}
