import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CONST_NAME_TOKEN } from 'src/constants/value.cont';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy role từ Decorator Role
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Nếu không yêu cầu vai trò, route này không yêu cầu bảo vệ
    }

    // Lấy role từ data user
    const request = context.switchToHttp().getRequest();
    const user = request[`${CONST_NAME_TOKEN}`];

    const hasRole = roles.some((role) => user.role?.includes(role)); // Kiểm tra xem user có vai trò được yêu cầu không
    if (!hasRole) {
      throw new ForbiddenException('Người dùng không có vai trò cần thiết');
    }

    return true;
  }
}
