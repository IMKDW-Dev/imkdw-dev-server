import { HttpException, HttpStatus } from '@nestjs/common';

export const CONFLICT_EXCEPTIONS = {
  DUPLICATE_EMAIL: '409001',
  DUPLICATE_CATEGORY_NAME: '409002',
} as const;

class ConfilctException extends HttpException {
  constructor(errorCode: string, data?: unknown) {
    super({ errorCode, data }, HttpStatus.CONFLICT);
  }
}

export class DuplicateEmailException extends ConfilctException {
  constructor(email?: string) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_EMAIL, `${email} is already in use`);
  }
}

export class DuplicateCategoryNameException extends ConfilctException {
  constructor(name?: string) {
    super(CONFLICT_EXCEPTIONS.DUPLICATE_CATEGORY_NAME, `${name} is already in use`);
  }
}
