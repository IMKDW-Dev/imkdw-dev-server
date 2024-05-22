import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import RequestCreateCategoryDto from '../dto/request/create-category.dto';
import ResponseGetCategoriesDto from '../dto/response/get-categories.dto';
import CategoryDto from '../dto/category.dto';

// eslint-disable-next-line import/prefer-default-export
export const createCategory = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateCategoryDto }),
    ApiConsumes('multipart/form-data'),
    ApiCreatedResponse({ description: '카테고리 생성 성공' }),
  );

export const getCategories = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({ name: 'limit', description: '조회할 카테고리의 수' }),
    ApiOkResponse({ type: ResponseGetCategoriesDto }),
  );

export const getCategoryDetail = (summary: string) =>
  applyDecorators(ApiOperation({ summary }), ApiParam({name: "name", description: "카테고리 이름"}),ApiOkResponse({ type: CategoryDto }));


export const updateCategory = (summary: string) => applyDecorators(
  ApiOperation({summary})
)