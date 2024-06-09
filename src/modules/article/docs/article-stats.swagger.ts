import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import ResponseGetArticleStatsDto from '../dto/response/article-stats/get-article-stats.dto';

// eslint-disable-next-line import/prefer-default-export
export const getArticleStats = (summary: string) =>
  applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: ResponseGetArticleStatsDto }));
