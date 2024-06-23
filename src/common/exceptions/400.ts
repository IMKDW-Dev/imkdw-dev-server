import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line import/prefer-default-export
export const BAD_REQUEST_EXCEPTIONS = {
  INVALID_CATEGORY_DESC: '400001',
  INVALID_CATEGORY_NAME: '400002',
  INVALID_ARTICLE_ID: '400003',
  INVALID_ARTICLE_TITLE: '400004',
  INVALID_ARTICLE_CONTENT: '400005',
  INVALID_TAG_NAME: '400006',
  INVALID_COMMENT_CONTENT: '400007',
} as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BadRequestException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.FORBIDDEN);
  }
}
