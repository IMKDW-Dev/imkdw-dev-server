import ArticleDetail from '../domain/entities/article-detail.entity';
import Article from '../domain/entities/article.entity';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import { ArticleQueryFilter } from './article-query.filter';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
export interface IArticleRepository {
  findOne(query: ArticleQueryFilter): Promise<Article>;
  save(article: Article): Promise<Article>;
  findArticleDetail(query: ArticleQueryFilter): Promise<ArticleDetail>;
  update(article: Article, data: UpdateArticleDto): Promise<Article>;
}
