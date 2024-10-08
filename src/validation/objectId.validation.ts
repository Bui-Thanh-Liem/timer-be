import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'IsObjectId', async: false })
export class IsObjectId implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return Types.ObjectId.isValid(text); // Kiểm tra xem chuỗi có phải là ObjectId hợp lệ
  }

  defaultMessage(args: ValidationArguments) {
    return 'Định dạng ObjectId không hợp lệ, phải là chuỗi hex 24 ký tự';
  }
}
