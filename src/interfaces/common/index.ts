export interface IDataUser<T> {
  user: T;
}

export interface IQueries {
  limit: string;
  page: string;
  isDeleted: boolean;
}

export interface IGetManyItem<T> {
  totalItems: number;
  items: Array<T>;
}

export interface ISoftDeleteModel<T> {
  deletedBy: T | string;
  deletedAt: Date;
  isDeleted: boolean;
}

export interface ITrackingModel<T> {
  createdBy: T | string;
  updatedBy?: T | string;
}