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
import ResponseCreateArticleDto from '../dto/response/create-article.dto';
import ArticleDto from '../dto/article.dto';

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
    ApiOkResponse({ type: [ArticleDto] }),
  );

export const addViewCount = (summary: string) =>
  applyDecorators(ApiOperation({ summary }), ApiParam({ name: 'articleId', description: '게시글 아이디' }));
