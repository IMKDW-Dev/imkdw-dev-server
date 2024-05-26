import Article from '../domain/entities/article.entity';
import { ArticleQueryFilter } from './article-query.filter';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
export interface IArticleRepository {
  findOne(query: ArticleQueryFilter): Promise<Article>;
  save(article: Article): Promise<Article>;
}
