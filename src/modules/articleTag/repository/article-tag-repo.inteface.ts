import { TX } from '../../../@types/prisma/prisma.type';
import Article from '../../article/domain/entities/article.entity';
import ArticleTag from '../domain/entities/article-tag.entity';

export const ARTICE_TAG_REPOSITORY = Symbol('ARTICE_TAG_REPOSITORY');
export interface IArticleTagRepository {
  createMany(article: Article, tags: ArticleTag[]): Promise<void>;
  deleteByArticleId(articleId: string, tx: TX): Promise<void>;
}
