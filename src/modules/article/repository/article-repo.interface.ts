import Article from '../domain/entities/article.entity';
import ArticleId from '../domain/value-objects/article-id.vo';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import { ArticleQueryFilter } from './article-query.filter';
import { ArticleQueryOption } from './article-query.option';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
export interface IArticleRepository {
  findOne(query: ArticleQueryFilter): Promise<Article>;
  findMany(query: ArticleQueryFilter, option?: ArticleQueryOption): Promise<Article[]>;
  findCounts(query: ArticleQueryFilter): Promise<number>;
  save(article: Article): Promise<Article>;
  update(id: ArticleId, data: UpdateArticleDto): Promise<Article>;
}
