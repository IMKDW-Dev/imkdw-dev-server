import { HttpException, HttpStatus } from '@nestjs/common';

export const CONFLICT_EXCEPTIONS = {
  DUPLICATE_EMAIL: '409001',
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
