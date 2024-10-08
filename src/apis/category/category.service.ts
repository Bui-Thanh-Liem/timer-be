import { Model, Types } from 'mongoose';
const ObjectId = Types.ObjectId;
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICategory, IFeedBack, ISubCategory } from 'src/interfaces/models';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AQueries } from 'src/abstracts/AQuery.abstract';
import { CONSTANT_FEEDBACK_IMAGE } from 'src/constants/message.cont';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category')
    private categoryModel: Model<ICategory>,
    @InjectModel('SubCategory')
    private subCategoryModel: Model<ISubCategory>,
    @InjectModel('Feedback')
    private feedbackModel: Model<IFeedBack>,
  ) {}

  //
  async create(dataCreate: CreateCategoryDto): Promise<ICategory> {
    // Check
    // const categoryInDataBase = await this.categoryModel.find({
    //   name: dataCreate.name,
    // });
    // if (categoryInDataBase.length > 0) {
    //   throw new BadRequestException('Tên danh mục đã tồn tại');
    // }

    //
    const category = new this.categoryModel({
      ...dataCreate,
    });

    //
    return category.save();
  }

  //
  async updateById(
    id: string,
    dataUpdate: UpdateCategoryDto,
  ): Promise<ICategory> {
    await this.findOneById(id);
    const categoryInDB = await this.categoryModel.find({
      name: dataUpdate.name,
    });
    if (categoryInDB.length > 0) {
      throw new BadRequestException('Danh mục đã tồn tại');
    }
    const categoryUpdated = await this.categoryModel.findByIdAndUpdate(
      { _id: id },
      dataUpdate,
    );

    return categoryUpdated;
  }

  //
  async findOneById(id: string): Promise<ICategory> {
    const obJectId = new ObjectId(id);
    const category = await this.categoryModel
      .find({ _id: obJectId })
      .exec();
    if (category.length === 0) {
      throw new NotFoundException(CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY);
    }

    return category[0];
  }

  //
  async findAll(queries: AQueries): Promise<Array<ICategory>> {
    try {
      if (!queries.isDeleted) queries.isDeleted = false;
      const categories = await this.categoryModel
        .find({ isDeleted: queries.isDeleted })
        .exec();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  //
  async softDeleteMany(ids: Array<string>) {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findCategory = await this.categoryModel.findById(id);

          if (!findCategory._id) {
            throw new NotFoundException(
              CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY,
            );
          }

          await this.categoryModel.findOneAndUpdate(
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

  //
  async restoreMany(ids: Array<string>) {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findCategory = await this.categoryModel.findById(id);

          if (!findCategory._id) {
            throw new NotFoundException(
              CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY,
            );
          }

          await this.categoryModel.findOneAndUpdate(
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

  //
  async deleteMany(ids: Array<string>): Promise<Boolean> {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findCategory = await this.categoryModel.findById(id);

          if (!findCategory._id) {
            throw new NotFoundException(
              CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY,
            );
          }

          if (!findCategory.isDeleted) {
            throw new BadRequestException('Xin vui lòng xóa mềm danh mục');
          }

          await this.categoryModel.deleteMany({
            _id: { $in: ids },
          });

          await this.subCategoryModel.updateMany(
            {
              categoryID: id,
            },
            { $set: { categoryID: '' } },
          );

          await this.feedbackModel.updateMany(
            { category: id },
            { $set: { category: '', subCategory: '' } },
          );

        }),
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getDataSelection() {
    try {
      const cates = await this.categoryModel.find({ isDeleted: false }).exec();
      const subCates = await this.subCategoryModel
        .find({ isDeleted: false })
        .exec();

      const result = cates.map((cate) => {
        return {
          name: cate.name,
          _id: cate._id,
          subCates: subCates.filter((subCate) => {
            const stringID = subCate._id.toString();
            return cate.subCategoriesID.includes(stringID);
          }),
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
