import { generateRandomNumber } from '../../../../../common/utils/number';
import User from '../../../../user/domain/models/user.model';
import Comment from '../../domain/models/comment.model';

interface Params {
  id?: number;
  author: User;
  articleId?: string;
  parentId?: number | null;
  content?: string;
  createdAt?: Date;
  replies?: Comment[];
}
// eslint-disable-next-line import/prefer-default-export
export const createComment = (params?: Params) => {
  return new Comment.builder()
    .setId(params?.id ?? generateRandomNumber(1, 1000))
    .setAuthor(params.author)
    .setArticleId(params?.articleId ?? 'articleId')
    .setParentId(params?.parentId ?? null)
    .setContent(params?.content ?? 'content')
    .setCreatedAt(params?.createdAt ?? new Date())
    .setReplies(params?.replies ?? [])
    .build();
};
