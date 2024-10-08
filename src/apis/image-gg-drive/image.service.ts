import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
const ObjectId = Types.ObjectId;

import { IImage } from 'src/interfaces/models';
import { CreateImageDto } from './image.dto';
import { GgDriveService } from 'src/libraries/gg-drive/gg-drive.service';
import {
  CONST_NAME_FOLDER_DRIVE,
  CONST_NAME_TOKEN,
} from 'src/constants/value.cont';
import * as sharp from 'sharp';
import { Readable } from 'stream';
import { Request } from 'express';
import { UtilValues } from 'src/utils/values.util';
import { IQueries } from 'src/interfaces/common';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel('Image')
    private imageModel: Model<IImage>,
  ) {}

  async create(req: Request, files: Array<Express.Multer.File>) {
    try {
      const findUserInDatabase = req[`${CONST_NAME_TOKEN}`];

      //
      const ggDrive = GgDriveService.driver();
      const folderName = CONST_NAME_FOLDER_DRIVE;
      const folderList = await ggDrive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      });

      //
      let folderId: any;
      if (!folderList.data.files.length) {
        const folderMetadata = {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        };

        const newFolder = await ggDrive.files.create({
          requestBody: folderMetadata,
        });
        folderId = newFolder.data.id;
      } else {
        folderId = folderList.data.files[0].id;
      }

      //
      const uploadPromises = files.map(async (file) => {
        const imageMetadata = await sharp(file.buffer).metadata();
        const { width, height } = imageMetadata;

        const fileStream = new Readable();
        fileStream._read = () => {};
        fileStream.push(file.buffer);
        fileStream.push(null);

        const fileUploaded = await ggDrive.files.create({
          requestBody: {
            name: file.originalname,
            mimeType: 'image/jpeg',
            parents: [folderId],
          },
          media: {
            mimeType: 'image/jpeg',
            body: fileStream,
          },
          fields: 'id, name, webViewLink',
        });
        const fileId = fileUploaded.data.id;

        // Set permission is public for every image have uploaded
        await ggDrive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        const dataCreate: CreateImageDto & Partial<IImage> = {
          format: file.mimetype.split('/')[1],
          key: fileId,
          size: file.size,
          width: width,
          heigh: height,
          alt: fileUploaded.data.name,
          url: UtilValues.valuesUrlDrive(fileId, width),
          createdBy: findUserInDatabase,
        };

        const uploadImg = new this.imageModel(dataCreate);
        const uploadedImg = await uploadImg.save();
        return uploadedImg;
      });

      const imagesUpload = await Promise.all(uploadPromises);
      return imagesUpload;
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string) {
    try {
      const img = await this.imageModel
        .findById({ _id: new ObjectId(id) })
        .exec();

      if (img?.isDeleted) {
        throw new BadRequestException('This image has been soft deleted');
      }

      if (!img) {
        throw new NotFoundException('Not found image');
      }
      return img;
    } catch (error) {
      throw error;
    }
  }

  async findOneByUrl(url: string) {
    try {
      const img = await this.imageModel.find({ url: url }).exec();
      if (img.length <= 0) {
        throw new NotFoundException('Image not found');
      }
      return img[0];
    } catch (error) {
      throw error;
    }
  }

  async deleteOneByUrl(url: string) {
    try {
      const img = await this.imageModel.findOneAndDelete({ url: url }).exec();
      if (!img._id) {
        throw new NotFoundException('Image not found');
      }
      const ggDrive = GgDriveService.driver();

      // Delete the file by its KEY
      const resultDeletedGgDrive = await ggDrive.files.delete({
        fileId: img.key,
      });
      return resultDeletedGgDrive;
    } catch (error) {
      throw error;
    }
  }

  async findAll(queries: IQueries) {
    try {
      const images = await this.imageModel.find({ isDeleted: queries }).exec();
      return images;
    } catch (error) {
      throw error;
    }
  }

  async softDeleteMany(ids: Array<string>) {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findImage = await this.imageModel.findById(id);

          if (!findImage._id) {
            throw new NotFoundException(
              'The image you want to soft delete does not exist.',
            );
          }

          await this.imageModel.findByIdAndUpdate(
            {
              _id: id,
            },
            { $set: { isDeleted: true } },
          );
        }),
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(ids: Array<string>): Promise<boolean> {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findImage = await this.imageModel.findById(id);

          if (!findImage?._id) {
            throw new BadRequestException(
              'The image you want to delete does not exist.',
            );
          }

          if (!findImage?.isDeleted) {
            throw new BadRequestException('Please soft delete the image');
          }

          await this.imageModel.deleteMany({
            _id: { $in: ids },
          });

          const ggDrive = GgDriveService.driver();

          // Delete the file by its KEY
          await ggDrive.files.delete({
            fileId: findImage.key,
          });
        }),
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
