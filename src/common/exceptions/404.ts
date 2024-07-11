import { HttpException, HttpStatus } from '@nestjs/common';

export const NOT_FOUND_EXCEPTIONS = {
  CATEGORY_NOT_FOUND: '404001',
  ARTICLE_NOT_FOUND: '404002',
  COMMENT_NOT_FOUND: '404003',
  USER_NOT_FOUND: '404004',
} as const;

class NotFoundException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.NOT_FOUND);
  }
}

export class CategoryNotFoundException extends NotFoundException {
  constructor(error: unknown) {
    super(NOT_FOUND_EXCEPTIONS.CATEGORY_NOT_FOUND, error);
  }
}

export class ArticleNotFoundException extends NotFoundException {
  constructor(error: unknown) {
    super(NOT_FOUND_EXCEPTIONS.ARTICLE_NOT_FOUND, error);
  }
}

export class CommentNotFoundException extends NotFoundException {
  constructor(error: unknown) {
    super(NOT_FOUND_EXCEPTIONS.COMMENT_NOT_FOUND, error);
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(error: unknown) {
    super(NOT_FOUND_EXCEPTIONS.USER_NOT_FOUND, error);
  }
}
