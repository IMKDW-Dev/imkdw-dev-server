import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import ArticleStatsService from '../services/article-stats.service';
import * as Swagger from '../docs/article-stats.swagger';
import ArticleStatsDto from '../dto/article-stats.dto';
import { Public } from '../../../auth/decorators/public.decorator';

@ApiTags('[게시글] 통계')
@Controller({ path: 'articles/stats', version: '1' })
@Public()
export default class ArticleStatsController {
  constructor(private readonly articleStatsService: ArticleStatsService) {}

  @Swagger.getArticleStats('게시글 통계 조회')
  @Get('count')
  async getArticleStats(): Promise<ArticleStatsDto> {
    return this.articleStatsService.getArticleStats();
  }
}
