import Article from '../domain/models/article.model';
import ArticleTag from '../domain/models/article-tag.model';

export const ARTICLE_TAG_REPOSITORY = Symbol('ARTICLE_TAG_REPOSITORY');
export interface IArticleTagRepository {
  createMany(article: Article, tags: ArticleTag[]): Promise<void>;
  deleteByArticleId(articleId: string): Promise<void>;
}
