import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

export function UploadImages(properties?: any, title?: string) {
  const defaultUpload = {
    images: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  };

  return applyDecorators(
    UseInterceptors(
      FilesInterceptor('images', 20, {
        limits: {
          fileSize: (1024 * 1024 * 10), // Giới hạn kích thước file
          fieldNameSize: 20, // Giới hạn kích thước tên trường
        },
      }),
    ),
    ApiOperation({ summary: `${title ? title : 'Tải ảnh lên ứng dụng'}` }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: properties || defaultUpload,
      },
    }),
  );
}
