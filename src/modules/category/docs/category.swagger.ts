import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import RequestCreateCategoryDto from '../dto/request/create-category.dto';

// eslint-disable-next-line import/prefer-default-export
export const createCategory = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateCategoryDto }),
    ApiConsumes('multipart/form-data'),
    ApiCreatedResponse({ description: '카테고리 생성 성공' }),
  );

export const getCategories = (summary: string) => applyDecorators(ApiOperation({ summary }));
