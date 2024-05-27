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
import ResponseCreateArticleDto from '../dto/response/create-article.dto';
import ArticleDetailDto from '../dto/article-detail.dto';
import { GetArticleFilter } from '../enums/article.enum';
import ArticleSummaryDto from '../dto/article-summary.dto';

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
    ApiOkResponse({ type: ArticleDetailDto }),
  );

export const getArticles = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({ name: 'filter', description: '게시글 조회 필터', enum: GetArticleFilter }),
    ApiOkResponse({ type: [ArticleSummaryDto] }),
  );
