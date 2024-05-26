import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import RequestCreateArticleDto from '../dto/request/create-article.dto';

export const createArticle = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: RequestCreateArticleDto }),
  );
