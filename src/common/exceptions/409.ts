import { HttpException, HttpStatus } from '@nestjs/common';

export const CONFLICT_EXCEPTIONS = {
  DUPLICATE_EMAIL: '409001',
  DUPLICATE_CATEGORY_NAME: '409002',
  DUPLICATE_ARTICLE_ID: '409003',
  DUPLICATE_NICKNAME: '409004',
} as const;

class ConfilctException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.CONFLICT);
  }
}

export class DuplicateEmailException extends ConfilctException {
  constructor(error: unknown) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_EMAIL, error);
  }
}

export class DuplicateCategoryNameException extends ConfilctException {
  constructor(name?: string) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_CATEGORY_NAME, `${name} is already in use`);
  }
}

export class DuplicateArticleIdException extends ConfilctException {
  constructor(id?: string) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_ARTICLE_ID, `${id} is already in use`);
  }
}

export class DuplicateNicknameException extends ConfilctException {
  constructor(error: unknown) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_NICKNAME, error);
  }
}
