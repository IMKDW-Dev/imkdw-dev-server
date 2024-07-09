import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import RequestCreateArticleDto from '../dto/request/create-article.dto';
import { GetArticleSort } from '../enums/article.enum';
import ArticleDto from '../dto/article.dto';
import ResponseGetArticlesDto from '../dto/response/get-article.dto';

export const createArticle = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: RequestCreateArticleDto }),
    ApiCreatedResponse({ type: ArticleDto }),
  );
};

export const getArticleDetail = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'articleId', description: '게시글 아이디' }),
    ApiOkResponse({ type: ArticleDto }),
  );
};

export const getArticles = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({ name: 'filter', description: '게시글 조회 필터', enum: GetArticleSort }),
    ApiOkResponse({ type: ResponseGetArticlesDto }),
  );
};

export const increaseViewCount = (summary: string) => {
  return applyDecorators(ApiOperation({ summary }), ApiParam({ name: 'articleId', description: '게시글 아이디' }));
};

export const deleteArticle = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ description: '삭제할 게시글 아이디', name: 'articleId' }),
  );
};

export const updateArticle = (summary: string) => {
  return applyDecorators(ApiOperation({ summary }));
};
