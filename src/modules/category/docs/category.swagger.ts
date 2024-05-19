import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import RequestCreateCategoryDto from '../dto/request/create-category.dto';

// eslint-disable-next-line import/prefer-default-export
export const createCategory = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateCategoryDto }),
    ApiCreatedResponse({ description: '카테고리 생성 성공' }),
  );
