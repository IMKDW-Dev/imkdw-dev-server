import ArticleCommentDto from '../dto/article-comment.dto';
import * as UserMapper from '../../user/mappers/user.mapper';
import ArticleComment from '../domain/models/article-comment.model';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (articleComment: ArticleComment): ArticleCommentDto =>
  new ArticleCommentDto(
    articleComment.getId(),
    articleComment.getArticleId(),
    articleComment.getContent(),
    articleComment.getCreatedAt(),
    UserMapper.toDto(articleComment.getAuthor()),
    articleComment.getReplies().map((reply) => toDto(reply)),
  );
