import { Inject } from '@nestjs/common';
import {
  ARTICLE_STATS_REPOSITORY,
  IArticleStatsRepository,
} from '../../repository/article-stats/article-stats-repo.interface';
import ResponseGetArticleStatsDto from '../../dto/response/article-stats/get-article-stats.dto';

export default class ArticleStatsService {
  constructor(@Inject(ARTICLE_STATS_REPOSITORY) private readonly articleStatsRepository: IArticleStatsRepository) {}

  async getArticleStats(): Promise<ResponseGetArticleStatsDto> {
    const articleStats = await this.articleStatsRepository.findStats();
    return ResponseGetArticleStatsDto.create(articleStats.toDto());
  }
}
