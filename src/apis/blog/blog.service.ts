import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { IBlog } from 'src/interfaces/models';
import { ImageLocalService } from '../imageLocal/imageLocal.service';
import { CreateBlogDto, UpdateBlogDto } from './blog.dto';
import { ETimer, ETypeTimer } from 'src/enums/common.enum';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog')
    private blogModel: Model<IBlog>,
    private imageLocalService: ImageLocalService,
  ) {}

  async create(
    req: Request,
    dataCreate: CreateBlogDto,
    uploadedFiles: Array<Express.Multer.File>,
  ) {
    try {
      const findUser = req['token'];

      //
      const findBlog = await this.blogModel
        .findOne({
          title: dataCreate.title,
        })
        .exec();
      if (findBlog) {
        throw new BadRequestException('Title đã tồn tại');
      }

      if (uploadedFiles.length === 0) {
        throw new BadRequestException('Vui lòng chọn một tập tin để tải lên');
      }

      //
      const createdImg = await this.imageLocalService.create(uploadedFiles);

      // 
      let toJS = JSON.parse(dataCreate.timer as any);
      if(!Object.keys(ETypeTimer).includes(toJS?.type)) {
        throw new BadRequestException('Timer type is invalid');
      }
      const schedule = toJS?.type !== ETypeTimer.NO ? ETimer.SCHEDULED : ETimer.NO;
      
      const data: Partial<IBlog> = {
        ...dataCreate,
        thumb: createdImg[0].url,
        schedule: schedule,
        createdBy: findUser,
      };

      const blog = new this.blogModel(data);
      return await blog.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    dataUpdate: UpdateBlogDto,
    uploadedFiles: Array<Express.Multer.File>,
  ) {
    try {
      //
      const findBlog = await this.blogModel.findById(id);

      //
      if (typeof uploadedFiles === 'object' && uploadedFiles?.length > 0) {
        await this.imageLocalService.deleteOneByUrl(findBlog?.thumb);
        const uploadImg = await this.imageLocalService.create(uploadedFiles);
        if (uploadImg[0].url) {
          dataUpdate.thumb = uploadImg[0].url;
        }
      }

      // 
      let toJS = JSON.parse(dataUpdate?.timer as any);
      if(!Object.keys(ETypeTimer).includes(toJS?.type)) {
        throw new BadRequestException('Timer type is invalid');
      }
      const schedule = toJS?.type !== ETypeTimer.NO ? ETimer.SCHEDULED : ETimer.NO;
      
      
      await this.blogModel.findOneAndUpdate(
        {
          _id: findBlog._id,
        },
        { $set: { ...dataUpdate, schedule: schedule } },
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const blogs = await this.blogModel.find().exec();
      return blogs;
    } catch (error) {
      throw error;
    }
  }

  async setPostBelongTimer(id: string) {
    try {

      // 
      const postBlog = await this.blogModel.findOne({ _id: id });
      if (!postBlog) {
        throw new NotFoundException('Not found post blog');
      }

      // 
      const updateBlog = await this.blogModel.findOneAndUpdate(
        {
          _id: postBlog._id,
        },
        { $set: { schedule: ETimer.POSTED } },
      );
      return updateBlog;
    } catch (error) {
      throw error;
    }
  }
}
