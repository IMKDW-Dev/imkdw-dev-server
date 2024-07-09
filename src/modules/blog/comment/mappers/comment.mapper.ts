import { articleComments } from '@prisma/client';

import CommentDto from '../dto/comment.dto';
import * as UserMapper from '../../../user/mappers/user.mapper';
import Comment from '../domain/models/comment.model';
import User from '../../../user/domain/models/user.model';

export const toDto = (comment: Comment): CommentDto => {
  return new CommentDto(
    comment.getId(),
    comment.getArticleId(),
    comment.getContent(),
    comment.getCreatedAt(),
    UserMapper.toDto(comment.getAuthor()),
    comment.getReplies().map((reply) => toDto(reply)),
  );
};

export const toModel = (comment: articleComments, author: User, replies?: Comment[]) => {
  return new Comment.builder()
    .setId(comment.id)
    .setParentId(comment.parentId)
    .setArticleId(comment.articleId)
    .setContent(comment.content)
    .setCreatedAt(comment.createdAt)
    .setAuthor(author)
    .setReplies(replies)
    .build();
};
