import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import RequestCreateArticleDto from '../dto/request/create-article.dto';
import ResponseCreateArticleDto from '../dto/response/create-article.dto';
import ArticleDetailDto from '../dto/article-detail.dto';

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
