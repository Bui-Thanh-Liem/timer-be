import slugify from 'slugify';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import { ImageLocalDto } from './imageLocal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IImageLocal } from 'src/interfaces/models';
import { formatDateToString } from 'src/utils/format.util';

@Injectable()
export class ImageLocalService {
  constructor(
    @InjectModel('ImageLocal')
    private imageLocalModel: Model<IImageLocal>,
  ) {}

  async create(files: Express.Multer.File[]) {
    try {
      const uploadPromises = files.map(async (file) => {
        const imageMetadata = await sharp(file.buffer).metadata();
        const { width, height } = imageMetadata;

        const uploadsPath = path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          'uploads',
        );
        console.log("file.originalname:::", file);
        const nameImageSlug = slugify(file.originalname, {
          lower: true,
          trim: true,
          remove: /[^a-zA-Z0-9.\s]+/
        });

        const strDate = formatDateToString();
        const filePath = path.join(uploadsPath, `${strDate}_${nameImageSlug}`);

        // Ensure the folder exists
        await fsPromises.mkdir(uploadsPath, { recursive: true });

        // Write file to the public/uploads directory
        await fsPromises.writeFile(filePath, file.buffer);

        const HOST_SERVER = `${process.env.SERVER_HOST}/uploads`;

        const dataCreate: ImageLocalDto = {
          format: file.mimetype.split('/')[1],
          size: file.size,
          width: width,
          heigh: height,
          url: `${HOST_SERVER}/${strDate}_${nameImageSlug}`,
          alt: file.originalname.split('.')[0],
        };
        const imageLocal = new this.imageLocalModel(dataCreate);
        return await imageLocal.save();
      });

      const imagesUpload = await Promise.all(uploadPromises);
      return imagesUpload;
    } catch (error) {
      throw error;
    }
  }

  //
  async findOneById(id: string) {
    try {
      const imageLocal = await this.imageLocalModel.findById(id);

      if (!imageLocal?._id) {
        throw new NotFoundException('Not found image local');
      }
      return imageLocal;
    } catch (error) {
      throw error;
    }
  }

  //
  async findOneByUrl(url: string) {
    try {
      console.log('url:::', url);
      const imageLocal = await this.imageLocalModel.find({
        url: url.trim(),
      });
      console.log('imageLocal:::', imageLocal);
      if (imageLocal.length <= 0) {
        throw new NotFoundException('Not found image local');
      }
      return imageLocal[0];
    } catch (error) {
      throw error;
    }
  }

  //
  async deleteOneByUrl(url: string) {
    try {
      await this.findOneByUrl(url);

      // Remove
      const arrUrl = url.split('/');
      const findIndex = arrUrl.findIndex((r) => r.includes('uploads'));
      const subUrl = `public/${arrUrl.slice(findIndex).join('/')}`;
      console.log('findIndex:::', findIndex);
      console.log('subUrl:::', subUrl);
      // return true;

      fs.rm(subUrl, (err) => {
        if (err) {
          throw new BadRequestException(err);
        }
      });

      const resultDeleted = await this.imageLocalModel.findOneAndDelete({
        url: url,
      });
      return resultDeleted;
    } catch (error) {
      throw error;
    }
  }
}
