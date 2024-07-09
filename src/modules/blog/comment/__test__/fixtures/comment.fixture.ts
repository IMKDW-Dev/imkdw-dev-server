import User from '../../../../../user/domain/models/user.model';
import Comment from '../../../domain/models/article-comment.model';

interface Params {
  id?: number;
  author: User;
  articleId?: string;
  parent?: Comment;
  content?: string;
  createdAt?: Date;
  replies?: Comment[];
}
// eslint-disable-next-line import/prefer-default-export
export const createComment = (params?: Params) => {
  return new Comment.builder()
    .setId(params?.id ?? 1)
    .setAuthor(params.author)
    .setArticleId(params?.articleId ?? 'articleId')
    .setParent(params?.parent ?? null)
    .setContent(params?.content ?? 'content')
    .setCreatedAt(params?.createdAt ?? new Date())
    .setReplies(params?.replies ?? [])
    .build();
};
