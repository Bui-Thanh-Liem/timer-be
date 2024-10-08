import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { IQueries } from 'src/interfaces/common';
import { ICategory, IFeedBack, ISubCategory } from 'src/interfaces/models';
import { CategoryService } from '../category/category.service';
import { ImageLocalService } from '../imageLocal/imageLocal.service';
import { SubCategoryService } from '../subCategory/SubCategory.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './feedback.dto';
import { CONSTANT_FEEDBACK_IMAGE } from 'src/constants/message.cont';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel('Feedback')
    private feedbackModel: Model<IFeedBack>,
    @InjectModel('SubCategory')
    private subCategoryModel: Model<ISubCategory>,
    @InjectModel('Category')
    private categoryModel: Model<ICategory>,
    private imageLocalService: ImageLocalService,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
  ) {}

  async create(
    req: Request,
    dataCreate: CreateFeedbackDto,
    uploadedFiles: Array<Express.Multer.File>,
  ) {
    try {
      const findUser = req['token'];

      //
      const findFeedback = await this.feedbackModel
        .findOne({
          nameFeedback: dataCreate.nameFeedback,
        })
        .exec();
      if (findFeedback) {
        throw new BadRequestException('Tên ảnh phản hồi đã tồn tại');
      }

      if (uploadedFiles.length === 0) {
        throw new BadRequestException('Vui lòng chọn một tập tin để tải lên');
      }

      //
      const findSubCategory = await this.subCategoryService.findOneById(
        dataCreate.subCategoryID,
      );

      if (!findSubCategory.categoryID) {
        throw new BadRequestException(CONSTANT_FEEDBACK_IMAGE.NOT_CATEGORY);
      }
      const findCategory = await this.categoryService.findOneById(
        findSubCategory.categoryID,
      );

      //
      const createdImg = await this.imageLocalService.create(uploadedFiles);

      const data: Partial<IFeedBack> = {
        ...dataCreate,
        url: createdImg[0].url,
        subCategory: dataCreate.subCategoryID,
        category: findCategory._id.toString(),
        createdBy: findUser,
      };

      const feedback = new this.feedbackModel(data);
      return await feedback.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    dataUpdate: UpdateFeedbackDto,
    uploadedFiles: Array<Express.Multer.File>,
  ) {
    try {
      //
      const findFeedback = await this.findOneById(id);

      //
      if (typeof uploadedFiles === 'object' && uploadedFiles?.length > 0) {
        await this.imageLocalService.deleteOneByUrl(findFeedback?.url);
        const uploadImg = await this.imageLocalService.create(uploadedFiles);
        if (uploadImg[0].url) {
          dataUpdate.url = uploadImg[0].url;
        }
      }

      //
      let dataUpdateCate: any = {};
      if (dataUpdate.subCategoryID) {
        const subCategory = await this.subCategoryService.findOneById(
          dataUpdate.subCategoryID,
        );
        if (!subCategory._id) {
          throw new BadRequestException(CONSTANT_FEEDBACK_IMAGE.NOT_FOUND);
        }
        if (!subCategory.categoryID) {
          throw new BadRequestException(CONSTANT_FEEDBACK_IMAGE.NOT_CATEGORY);
        }
        const findCategory = await this.categoryService.findOneById(
          subCategory.categoryID,
        );

        dataUpdateCate = {
          category: {
            _id: findCategory._id,
            name: findCategory.name,
          },
          subCategory: {
            _id: subCategory._id,
            name: subCategory.name,
          },
        };
      }

      delete dataUpdate.subCategoryID;
      const updateFeedback = await this.feedbackModel.findOneAndUpdate(
        {
          _id: findFeedback._id,
        },
        { $set: { ...dataUpdate, ...dataUpdateCate } },
      );
      return updateFeedback;
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string) {
    try {
      const img = await this.feedbackModel
        .find({ _id: id, isDeleted: false })
        .exec();

      if (img.length === 0) {
        throw new NotFoundException(CONSTANT_FEEDBACK_IMAGE.NOT_FOUND);
      }
      return img[0];
    } catch (error) {
      throw error;
    }
  }

  async findAll(queries: IQueries) {
    try {
      let results: Partial<IFeedBack>[] = [];

      if (!queries.isDeleted) queries.isDeleted = false;

      // Tìm tất cả feedback với điều kiện isDeleted
      const feedback = await this.feedbackModel.find({
        isDeleted: queries.isDeleted,
      });

      // Tạo mảng các promise để lấy subCategory và category song song cho mỗi feedback
      const promises = feedback.map(async (fb) => {

        // 
        const findSubCategoryPromise = fb.subCategory
          ? this.subCategoryModel.findById(fb.subCategory as string)
          : null;

        const findCategoryPromise = fb.category
          ? this.categoryModel.findById(fb.category as string)
          : null;

        // 
        const [findSubCategory, findCategory] = await Promise.all([
          findSubCategoryPromise,
          findCategoryPromise,
        ]);

        // Trả về đối tượng kết quả
        return {
          ...fb.toObject(),
          subCategory: {
            _id: findSubCategory?._id.toString() || "",
            name: findSubCategory?.name || "",
            isDeleted: findSubCategory?.isDeleted || false,
          },
          category: {
            _id: findCategory?._id.toString() || "",
            name: findCategory?.name || "",
            isDeleted: findCategory?.isDeleted || false,
          },
        };
      });

      //
      results = await Promise.all(promises);
      // results = results.filter(item => item !== null)
      return results;
    } catch (error) {
      throw error;
    }
  }

  async findAllByCategoryID(id: string, queries: IQueries) {
    try {
      const cate = await this.categoryService.findOneById(id);
      if (cate.isDeleted) {
        return [];
      }

      const feedback = await this.feedbackModel.find({
        categoryID: id,
        isDeleted: queries.isDeleted,
      });
      if (feedback.length === 0) {
        throw new BadRequestException(CONSTANT_FEEDBACK_IMAGE.NOT_FOUND);
      }
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  async softDeleteMany(ids: Array<string>) {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findFeedback = await this.findOneById(id);
          console.log('findFeedback:::', findFeedback);

          if (!findFeedback?._id) {
            throw new NotFoundException(CONSTANT_FEEDBACK_IMAGE.NOT_FOUND);
          }

          await this.feedbackModel.findOneAndUpdate(
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

  async restoreMany(ids: Array<string>) {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findFeedback = await this.feedbackModel.findById(id);

          if (!findFeedback._id) {
            throw new NotFoundException(CONSTANT_FEEDBACK_IMAGE.NOT_FOUND);
          }

          await this.feedbackModel.findOneAndUpdate(
            {
              _id: id,
            },
            { $set: { isDeleted: false } },
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
          const findFeedback = await this.feedbackModel.findById(id);

          if (!findFeedback._id) {
            throw new BadRequestException(
              'Ảnh phản hồi bạn muốn xóa không tồn tại.',
            );
          }

          if (!findFeedback.isDeleted) {
            throw new BadRequestException('Vui lòng xóa mềm ảnh phản hồi');
          }

          const deleteFeedback = await this.feedbackModel.findByIdAndDelete(id);
          await this.imageLocalService.deleteOneByUrl(deleteFeedback.url);
        }),
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
