import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line import/prefer-default-export
export const BAD_REQUEST_EXCEPTIONS = {
  INVALID_CATEGORY_DESC: '400001',
  INVALID_CATEGORY_NAME: '400002',
} as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BadRequestException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.FORBIDDEN);
  }
}
