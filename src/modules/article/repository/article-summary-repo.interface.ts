import ArticleSummaryDto from '../dto/article-summary.dto';

export const ARTICLE_SUMMARY_REPOSITORY = Symbol('ARTICLE_SUMMARY_REPOSITORY');
export interface IArticleSummaryRepository {
  findLatestArticles(limit: number): Promise<ArticleSummaryDto[]>;
  findArticlesOrderByViewCount(limit: number): Promise<ArticleSummaryDto[]>;
}
