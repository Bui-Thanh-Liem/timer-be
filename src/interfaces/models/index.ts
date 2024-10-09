import { Types } from 'mongoose';
import { ETimer } from 'src/enums/common.enum';

export interface IBaseModel {
  _id: string;
  isDeleted: boolean;
  deletedAt: Date;
}

export interface IUser extends IBaseModel {
  account: string;
  password: string;
  role: string;
  isAdmin: boolean;
  roleEng: string;
}

export interface IToken extends IBaseModel {
  token_code: string;
  token_secretKey: string;
  token_user: string; // id user
}

export interface ISubCategory extends IBaseModel {
  name: string;
  categoryID: string;
}

export interface IImage extends IBaseModel {
  alt: string;
  url: string;
  format: string;
  key: string;
  size: number;
  width: number;
  heigh: number;
  deletedAt: Date;
  deletedBy: IUser | Types.ObjectId;
  createdBy: IUser | Types.ObjectId;
  updatedBy: IUser | Types.ObjectId;
}

export interface IImageLocal extends IBaseModel {
  alt: string;
  url: string;
  format: string;
  size: number;
  width: number;
  heigh: number;
  deletedAt: Date;
  deletedBy: IUser | Types.ObjectId;
  createdBy: IUser | Types.ObjectId;
  updatedBy: IUser | Types.ObjectId;
}

export interface IFeedBack extends IBaseModel {
  nameFeedback: string;
  url: string;
  description: string;
  subCategory: string | Partial<ISubCategory>;
  category: string | Partial<ICategory>;
  deletedAt: Date;
  deletedBy: IUser | Types.ObjectId;
  createdBy: IUser | Types.ObjectId;
  updatedBy: IUser | Types.ObjectId;
}

export interface IBlog extends IBaseModel {
  title: string;
  content: string;
  thumb: string;
  timer: ITimer;
  schedule: ETimer;
  createdBy: IUser | Types.ObjectId;
}

export interface ICategory extends IBaseModel {
  name: string;
  subCategoriesID: Array<string>;
}

// export class ITimer {
//   type: ETypeTimer;
//   value: number;
// }
export class ITimer {
  date: string;
  time: string;
}
