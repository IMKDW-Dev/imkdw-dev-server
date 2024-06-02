import { HttpException, HttpStatus } from '@nestjs/common';

export const NOT_FOUND_EXCEPTIONS = {
  CATEGORY_NOT_FOUND: '404001',
  ARTICLE_NOT_FOUND: '404002',
  ARTICLE_COMMENT_NOT_FOUND: '404003',
} as const;

class NotFoundException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.NOT_FOUND);
  }
}

export class CategoryNotFoundException extends NotFoundException {
  constructor(category?: unknown) {
    super(NOT_FOUND_EXCEPTIONS.CATEGORY_NOT_FOUND, `Find by ${category}, but not found`);
  }
}

export class ArticleNotFoundException extends NotFoundException {
  constructor(articleId?: unknown) {
    super(NOT_FOUND_EXCEPTIONS.ARTICLE_NOT_FOUND, `Find by ${articleId}, but not found`);
  }
}

export class ArticleCommentNotFoundException extends NotFoundException {
  constructor(commentId?: unknown) {
    super(NOT_FOUND_EXCEPTIONS.ARTICLE_COMMENT_NOT_FOUND, `Find by ${commentId}, but not found`);
  }
}
