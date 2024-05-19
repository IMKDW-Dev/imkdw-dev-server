import { HttpException, HttpStatus } from '@nestjs/common';

export const NOT_FOUND_EXCEPTIONS = {
  CATEGORY_NOT_FOUND: '404001',
} as const;

class NotFoundException extends HttpException {
  constructor(errorCode: string, data?: unknown) {
    super({ errorCode, data }, HttpStatus.NOT_FOUND);
  }
}

export class CategoryNotFoundException extends NotFoundException {
  constructor(email?: unknown) {
    super(NOT_FOUND_EXCEPTIONS.CATEGORY_NOT_FOUND, `Find by ${email}, but not found`);
  }
}
