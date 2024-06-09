import ArticleStats from '../../domain/entities/article-stats.entity';

export const ARTICLE_STATS_REPOSITORY = Symbol('ARTICLE_STATS_REPOSITORY');

export interface IArticleStatsRepository {
  findStats(): Promise<ArticleStats>;
}
