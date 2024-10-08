import { Connection, Model, Types } from 'mongoose';
const ObjectId = Types.ObjectId;
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUser } from 'src/interfaces/models';
import { CreateUserDto } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<IUser>,
  ) {
    this.initAdmin();
  }

  //
  async create(dataCreate: CreateUserDto): Promise<IUser> {
    try {
      // Check account
      const userInDataBase = await this.userModel.find({
        account: dataCreate.account,
      });
      if (userInDataBase.length > 0) {
        throw new BadRequestException('Tên người dùng đã tồn tại');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dataCreate.password, salt);

      //
      const user = new this.userModel({
        ...dataCreate,
        password: hashedPassword,
      });

      //
      return user.save();
    } catch (error) {
      throw error;
    }
  }

  //
  async updateById(
    id: string,
    dataUpdate: Partial<CreateUserDto>,
  ): Promise<IUser> {
    try {
      await this.findOneById(id);
      const userUpdate = await this.userModel.findOneAndUpdate(
        { _id: id },
        dataUpdate,
      );
      return userUpdate;
    } catch (error) {
      throw error;
    }
  }

  //
  async findOneById(id: string): Promise<IUser> {
    try {
      const obJectId = new ObjectId(id);
      const user = await this.userModel
        .findById({ _id: obJectId })
        .select('-password')
        .exec();
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  //
  async findAll(): Promise<Array<IUser>> {
    try {
      const users = await this.userModel.find().select('-password').exec();
      return users;
    } catch (error) {
      throw error;
    }
  }

  //
  async deleteOneById(id: string): Promise<boolean> {
    try {
      const userDeleted = await this.userModel.findOneAndDelete({ _id: id });
      if (!userDeleted) {
        throw new NotFoundException(
          'Người dùng bạn muốn xóa không tồn tại',
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  //
  async deleteManyByIds(ids: Array<string>): Promise<boolean> {
    try {
      const idsLength = ids.length;
      const usersDeleted = await this.userModel.deleteMany({
        _id: { $in: ids },
      });
      return usersDeleted.acknowledged;
    } catch (error) {
      throw error;
    }
  }

  private async initAdmin() {
    try {
      //
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(`${process.env.ADMIN_PASSWORD}`, salt);
  
      //
      await this.userModel.findOneAndUpdate(
        {
          $or: [{ account: process.env.ADMIN_ACCOUNT }, { isAdmin: true }],
        },
        {
          $setOnInsert: {
            account: process.env.ADMIN_ACCOUNT,
            role: 'admin',
            roleEng: 'administrator',
            password: hashedPassword,
            isAdmin: true,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );
  
    } catch (error) {
      throw error;
    }
  }
}
