import ArticleComment from '../domain/entities/article-comment.entity';
import ArticleCommentDto from '../dto/article-comment.dto';
import * as UserMapper from '../../user/mappers/user.mapper';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (articleComment: ArticleComment): ArticleCommentDto => {
  return ArticleCommentDto.create({
    id: articleComment.id,
    articleId: articleComment.articleId,
    content: articleComment.content,
    author: UserMapper.toDto(articleComment.author),
    parentId: articleComment.parentId,
    replies: articleComment.replies.map((reply) => toDto(reply)),
    createdAt: articleComment.createdAt,
  });
};
