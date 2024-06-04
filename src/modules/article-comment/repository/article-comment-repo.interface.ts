import ArticleComment from '../domain/entities/article-comment.entity';
import { ArticleCommentQueryFilter } from './article-comment-query.filter';

export const ARTICLE_COMMENT_REPOSITORY = Symbol('ARTICLE_COMMENT_REPOSITORY');
export interface IArticleCommentRepository {
  findOne(filter: ArticleCommentQueryFilter): Promise<ArticleComment>;
  save(comment: ArticleComment): Promise<ArticleComment>;
}