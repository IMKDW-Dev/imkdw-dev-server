import { QueryOption } from '../../../common/interfaces/common-query.filter';
import Article from '../domain/entities/article.entity';
import ArticleId from '../domain/value-objects/article-id.vo';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import { ArticleQueryFilter } from './article-query.filter';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
export interface IArticleRepository {
  findOne(query: ArticleQueryFilter): Promise<Article>;
  findMany(
    query: ArticleQueryFilter,
    option?: QueryOption<Pick<Article, 'createdAt' | 'viewCount'>>,
  ): Promise<Article[]>;
  save(article: Article): Promise<Article>;
  update(id: ArticleId, data: UpdateArticleDto): Promise<Article>;
}
