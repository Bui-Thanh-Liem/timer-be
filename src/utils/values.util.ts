import { ISoftDeleteModel, ITrackingModel } from 'src/interfaces/common';
import { IUser } from 'src/interfaces/models';

export class UtilValues {
  static valuesTableSelected<T>(cols: Array<keyof T>): Record<string, boolean> {
    const valuesSelected = {};
    for (let i = 0; i < cols.length; i++) {
      valuesSelected[cols[i] as string] = true;
    }
    return valuesSelected;
  }

  static valuesUrlDrive(id: string, width: number): string {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
  }

  static valuesDefaultSelected(): Record<
    string,
    boolean | { user_fullName: boolean }
  > {
    return {
      id: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      version: true,
      deletedBy: {
        user_fullName: true,
      },
      createdBy: {
        user_fullName: true,
      },
      updatedBy: {
        user_fullName: true,
      },
    };
  }

  static valuesDefaultSelectedQueriesBuilder(aliasName: string): string[] {
    return [
      `${aliasName}.id`,
      `${aliasName}.createdAt`,
      `${aliasName}.updatedAt`,
      `${aliasName}.deletedAt`,
      `${aliasName}.version`,
      `${aliasName}.isDeleted`,
      `deletedBy.user_fullName`,
      `createdBy.user_fullName`,
      `updatedBy.user_fullName`,
    ];
  }

  static valuesDefaultRef(): Array<
    keyof ISoftDeleteModel<IUser> | keyof ITrackingModel<IUser>
  > {
    return [`deletedBy`, `createdBy`, `updatedBy`];
  }
}
