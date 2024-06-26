import { articleComments } from '@prisma/client';

import ArticleCommentDto from '../dto/article-comment.dto';
import * as UserMapper from '../../user/mappers/user.mapper';
import ArticleComment from '../domain/models/article-comment.model';
import User from '../../user/domain/models/user.model';

export const toDto = (articleComment: ArticleComment): ArticleCommentDto => {
  return new ArticleCommentDto(
    articleComment.getId(),
    articleComment.getArticleId(),
    articleComment.getContent(),
    articleComment.getCreatedAt(),
    UserMapper.toDto(articleComment.getAuthor()),
    articleComment.getReplies().map((reply) => toDto(reply)),
  );
};

export const toModel = (comment: articleComments, author: User, replies?: ArticleComment[]) => {
  console.log(replies);
  return new ArticleComment.builder()
    .setId(comment.id)
    .setArticleId(comment.articleId)
    .setContent(comment.content)
    .setCreatedAt(comment.createdAt)
    .setAuthor(author)
    .setReplies(replies)
    .build();
};
