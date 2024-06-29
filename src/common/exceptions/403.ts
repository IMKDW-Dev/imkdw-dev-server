import { HttpException, HttpStatus } from '@nestjs/common';

export const FORBIDDEN_EXCEPTIONS = {
  CANNOT_REPLY_ON_REPLY_COMMENT: '403001',
  CATEGORY_HAVE_ARTICLES: '403002',
  USER_MISMATCH: '403003',
} as const;

class ForbiddenException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.FORBIDDEN);
  }
}

export class CannotReplyOnReplyCommentException extends ForbiddenException {
  constructor(error: unknown) {
    super(FORBIDDEN_EXCEPTIONS.CANNOT_REPLY_ON_REPLY_COMMENT, error);
  }
}

export class CategoryHaveArticlesException extends ForbiddenException {
  constructor(categoryId?: unknown) {
    super(FORBIDDEN_EXCEPTIONS.CATEGORY_HAVE_ARTICLES, `Category have articles ${categoryId}`);
  }
}

export class UserMismatchException extends ForbiddenException {
  constructor(requester: unknown, param: unknown) {
    super(FORBIDDEN_EXCEPTIONS.USER_MISMATCH, `User mismatch, requester: ${requester}, param: ${param}`);
  }
}
