import { QueryOption } from '../../../common/interfaces/common-query.filter';
import Article from '../domain/entities/article.entity';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import { ArticleQueryFilter } from './article-query.filter';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
export interface IArticleRepository {
  findOne(query: ArticleQueryFilter): Promise<Article>;
  findMany(query: ArticleQueryFilter): Promise<Article[]>;
  save(article: Article): Promise<Article>;
  update(article: Article, data: UpdateArticleDto): Promise<Article>;

  findLatestArticles(option?: QueryOption): Promise<Article[]>;
  findManyOrderByViewCount(option?: QueryOption): Promise<Article[]>;
}
