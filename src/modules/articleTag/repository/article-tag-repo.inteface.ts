import { TX } from '../../../@types/prisma/prisma.type';
import Article from '../../article/domain/models/article.model';
import ArticleTag from '../domain/models/article-tag.model';

export const ARTICLE_TAG_REPOSITORY = Symbol('ARTICLE_TAG_REPOSITORY');
export interface IArticleTagRepository {
  createMany(article: Article, tags: ArticleTag[], tx?: TX): Promise<void>;
  deleteByArticleId(articleId: string, tx: TX): Promise<void>;
}
