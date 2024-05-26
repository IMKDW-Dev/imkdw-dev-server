import ArticleDetailDto from '../dto/article-detail.dto';
import { ArticleQueryFilter } from './article-query.filter';

export const ARTICLE_DETAIL_REPOSITORY = Symbol('ARTICLE_DETAIL_REPOSITORY');
export interface IArticleDetailRepository {
  findOne(filter: ArticleQueryFilter): Promise<ArticleDetailDto | null>;
}
