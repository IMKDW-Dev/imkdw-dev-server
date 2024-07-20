import Comment from '../domain/models/comment.model';
import { CommentQueryFilter } from './comment-query.filter';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');
export interface ICommentRepository {
  findOne(filter: CommentQueryFilter): Promise<Comment>;
  findMany(filter: CommentQueryFilter): Promise<Comment[]>;

  save(comment: Comment): Promise<Comment>;
  saveMany(comments: Comment[]): Promise<void>;

  count(): Promise<number>;

  deleteByArticleId(articleId: string): Promise<void>;
}
