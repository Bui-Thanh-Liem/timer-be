import { Model, Types } from 'mongoose';
const ObjectId = Types.ObjectId;
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICategory, IFeedBack, ISubCategory } from 'src/interfaces/models';
import { CreateSubCategoryDto } from './subCategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryService } from '../category/category.service';
import { AQueries } from 'src/abstracts/AQuery.abstract';
import { CONSTANT_FEEDBACK_IMAGE } from 'src/constants/message.cont';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel('SubCategory')
    private subCategoryModel: Model<ISubCategory>,
    @InjectModel('Category')
    private readonly categoryModel: Model<ICategory>,
    @InjectModel('Feedback')
    private readonly feedBackModel: Model<IFeedBack>,
    private readonly categoryService: CategoryService,
  ) {}

  //
  async create(dataCreate: CreateSubCategoryDto): Promise<ISubCategory> {
    try {
      // Check exist name
      // const categoryInDataBase = await this.subCategoryModel.find({
      //   name: dataCreate.name,
      // });

      // if (categoryInDataBase.length > 0) {
      //   throw new BadRequestException('Tên danh mục đã tồn tại');
      // }

      // Check exist category
      await this.categoryService.findOneById(dataCreate.categoryID);

      //
      const subCategory = new this.subCategoryModel({
        ...dataCreate,
      });

      //
      const newSub = await subCategory.save();

      // Update category
      await this.categoryModel.updateOne(
        { _id: dataCreate.categoryID },
        {
          $push: { subCategoriesID: newSub._id.toString() },
        },
      );

      return newSub;
    } catch (error) {
      throw error;
    }
  }

  //
  async updateById(
    id: string,
    dataUpdate: Partial<CreateSubCategoryDto>,
  ): Promise<ISubCategory> {
    try {
      // Find in database
      const subCate = await this.findOneById(id);

      // Check exist category
      let categoryNew: ICategory;
      if (dataUpdate.categoryID) {
        // Old
        if (subCate.categoryID) {
          const categoryOld = await this.categoryModel.findById(
            subCate.categoryID,
          );
          let subCategoriesIdOld = categoryOld.subCategoriesID?.filter((c) => {
            return c !== subCate._id.toString();
          });
          this.categoryService.updateById(subCate.categoryID, {
            subCategoriesID: subCategoriesIdOld,
          });
        }

        // New
        categoryNew = await this.categoryModel.findById(dataUpdate.categoryID);
        const subCategoriesID = categoryNew.subCategoriesID;
        if (!subCategoriesID.includes(id)) {
          subCategoriesID.push(id);
        }
        await this.categoryService.updateById(dataUpdate.categoryID, {
          subCategoriesID: subCategoriesID,
        });

        //
        const updateFeedback = await this.feedBackModel.findOne({
          category: subCate.categoryID,
        });

        if(updateFeedback) {
          updateFeedback.category = categoryNew._id.toString();
          updateFeedback.save();
        }
      }

      //
      const subCategoryUpdated = await this.subCategoryModel.findByIdAndUpdate(
        { _id: id },
        dataUpdate,
      );

      return subCategoryUpdated;
    } catch (error) {
      throw error;
    }
  }

  //
  async findOneById(id: string): Promise<ISubCategory> {
    try {
      const subCategory = await this.subCategoryModel
        .findById({ _id: new ObjectId(id) })
        .exec();
      if (!subCategory) {
        throw new NotFoundException(CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY);
      }

      return subCategory;
    } catch (error) {
      throw error;
    }
  }

  //
  async findAll(queries: AQueries): Promise<Array<ISubCategory>> {
    try {
      if (!queries.isDeleted) queries.isDeleted = false;
      const subCategories = await this.subCategoryModel
        .find({ isDeleted: queries.isDeleted })
        .exec();
      return subCategories;
    } catch (error) {
      throw error;
    }
  }

  //
  async findAllByCategoryId(categoryID: string): Promise<Array<ISubCategory>> {
    try {
      const cate = await this.categoryModel
        .find({ _id: categoryID, isDeleted: true })
        .exec();
      if (cate.length > 0) {
        throw new BadRequestException('Danh mục chính không tồn tại');
      }

      const subCategories = await this.subCategoryModel
        .find({ categoryID: categoryID })
        .exec();
      return subCategories;
    } catch (error) {
      throw error;
    }
  }

  //
  async restoreMany(ids: Array<string>) {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findSubCategory = await this.subCategoryModel.findById(id);

          if (!findSubCategory._id) {
            throw new NotFoundException(
              CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY,
            );
          }

          await this.subCategoryModel.findOneAndUpdate(
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
  async softDeleteMany(ids: Array<string>) {
    try {
      await Promise.all(
        ids.map(async (id) => {
          const findSubCategory = await this.findOneById(id);

          if (!findSubCategory._id) {
            throw new NotFoundException(
              CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY,
            );
          }

          await this.subCategoryModel.findOneAndUpdate(
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
  async deleteManyByIds(ids: Array<string>): Promise<Boolean> {
    try {
      await Promise.all(
        ids.map(async (id) => {
          //
          const findSubCategory = await this.findOneById(id);

          //
          if (!findSubCategory._id) {
            throw new NotFoundException(
              CONSTANT_FEEDBACK_IMAGE.NOT_FOUND_CATEGORY,
            );
          }

          //
          const deleteSub = await this.subCategoryModel.findOneAndDelete({
            _id: new ObjectId(id),
          });

          //
          const category = await this.categoryModel.findById(
            deleteSub.categoryID,
          );
          if (category) {
            category.subCategoriesID = category.subCategoriesID.filter(
              (id) => !id.includes(id),
            );
            await category.save();
          }
        }),
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
