import { TX } from '../../../../@types/prisma/prisma.type';
import Article from '../../domain/entities/article.entity';
import { ArticleQueryFilter } from './article-query.filter';
import { ArticleQueryOption } from './article-query.option';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
export interface IArticleRepository {
  findOne(query: ArticleQueryFilter, option?: ArticleQueryOption): Promise<Article>;
  findMany(query: ArticleQueryFilter, option?: ArticleQueryOption): Promise<Article[]>;
  findCounts(query: ArticleQueryFilter, option?: ArticleQueryOption): Promise<number>;
  findIds(query: ArticleQueryFilter): Promise<string[]>;
  save(article: Article, tx: TX): Promise<Article>;
  update(article: Article): Promise<Article>;
  delete(article: Article, tx: TX): Promise<void>;
}
