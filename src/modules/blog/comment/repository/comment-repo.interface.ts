import Comment from '../domain/models/comment.model';
import { ArticleCommentQueryFilter } from './comment-query.filter';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');
export interface ICommentRepository {
  findOne(filter: ArticleCommentQueryFilter): Promise<Comment>;
  findMany(filter: ArticleCommentQueryFilter): Promise<Comment[]>;

  save(comment: Comment): Promise<Comment>;
  saveMany(comments: Comment[]): Promise<void>;

  deleteByArticleId(articleId: string): Promise<void>;
}
