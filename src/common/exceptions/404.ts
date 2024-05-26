import { HttpException, HttpStatus } from '@nestjs/common';

export const NOT_FOUND_EXCEPTIONS = {
  CATEGORY_NOT_FOUND: '404001',
  ARTICLE_NOT_FOUND: '404002',
} as const;

class NotFoundException extends HttpException {
  constructor(errorCode: string, data?: unknown) {
    super({ errorCode, data }, HttpStatus.NOT_FOUND);
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
