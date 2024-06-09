import { Controller, Get } from '@nestjs/common';
import ArticleStatsService from '../services/article/article-stats.service';
import * as Swagger from '../docs/article-stats.swagger';
import { Public } from '../../auth/decorators/public.decorator';
import ResponseGetArticleStatsDto from '../dto/response/article-stats/get-article-stats.dto';

@Controller({ path: 'articles/stats', version: '1' })
@Public()
export default class ArticleStatsController {
  constructor(private readonly articleStatsService: ArticleStatsService) {}

  @Swagger.getArticleStats('게시글 통계 조회')
  @Get('count')
  async getArticleStats(): Promise<ResponseGetArticleStatsDto> {
    return this.articleStatsService.getArticleStats();
  }
}
