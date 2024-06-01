import { HttpException, HttpStatus } from '@nestjs/common';

export const FORBIDDEN_EXCEPTIONS = {
  /**
   * 대댓글에는 댓글을 등록 할 수 없다
   */
  CANNOT_REPLY_ON_REPLY_COMMENT: '403001',

  /**
   * 게시글이 존재하는 카테고리는 삭제할 수 없다
   */
  CATEGORY_HAVE_ARTICLES: '403002',
} as const;

class ForbiddenException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.FORBIDDEN);
  }
}

export class CannotReplyOnReplyCommentException extends ForbiddenException {
  constructor(commentId?: unknown) {
    super(FORBIDDEN_EXCEPTIONS.CANNOT_REPLY_ON_REPLY_COMMENT, `Cannot reply on reply comment ${commentId}`);
  }
}

export class CategoryHaveArticlesException extends ForbiddenException {
  constructor(categoryId?: unknown) {
    super(FORBIDDEN_EXCEPTIONS.CATEGORY_HAVE_ARTICLES, `Category have articles ${categoryId}`);
  }
}
