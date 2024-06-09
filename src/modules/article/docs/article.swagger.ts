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
import RequestCreateArticleDto from '../dto/request/article/create-article.dto';
import { GetArticleSort } from '../enums/article.enum';
import ResponseCreateArticleDto from '../dto/response/article/create-article.dto';
import ArticleDto from '../dto/article.dto';
import ResponseGetArticlesDto from '../dto/response/article/get-article.dto';

export const createArticle = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: RequestCreateArticleDto }),
    ApiCreatedResponse({ type: ResponseCreateArticleDto }),
  );

export const getArticleDetail = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'articleId', description: '게시글 아이디' }),
    ApiOkResponse({ type: ArticleDto }),
  );

export const getArticles = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({ name: 'filter', description: '게시글 조회 필터', enum: GetArticleSort }),
    ApiOkResponse({ type: ResponseGetArticlesDto }),
  );

export const addViewCount = (summary: string) =>
  applyDecorators(ApiOperation({ summary }), ApiParam({ name: 'articleId', description: '게시글 아이디' }));

export const deleteArticle = (summary: string) =>
  applyDecorators(ApiOperation({ summary }), ApiParam({ description: '삭제할 게시글 아이디', name: 'articleId' }));

export const updateArticle = (summary: string) => applyDecorators(ApiOperation({ summary }));
