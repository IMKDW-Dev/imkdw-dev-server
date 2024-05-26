import { HttpException, HttpStatus } from '@nestjs/common';

export const CONFLICT_EXCEPTIONS = {
  DUPLICATE_EMAIL: '409001',
  DUPLICATE_CATEGORY_NAME: '409002',
  DUPLICATE_ARTICLE_ID: '409003',
} as const;

class ConfilctException extends HttpException {
  constructor(errorCode: string, data?: unknown) {
    super({ errorCode, data }, HttpStatus.CONFLICT);
  }
}

export class DuplicateEmailException extends ConfilctException {
  constructor(email?: string) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_EMAIL, `[DuplicateEmailException] ${email} is already in use`);
  }
}

export class DuplicateCategoryNameException extends ConfilctException {
  constructor(name?: string) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_CATEGORY_NAME, `[DuplicateCategoryNameException] ${name} is already in use`);
  }
}

export class DuplicateArticleIdException extends ConfilctException {
  constructor(id?: string) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_ARTICLE_ID, `[DuplicateArticleIdException ${id} is already in use`);
  }
}
