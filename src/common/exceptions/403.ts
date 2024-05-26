import { HttpException, HttpStatus } from '@nestjs/common';

export const FORBIDDEN_EXCEPTIONS = {
  CANNOT_REPLY_ON_REPLY_COMMENT: '403001',
} as const;

class ForbiddenException extends HttpException {
  constructor(errorCode: string, data?: unknown) {
    super({ errorCode, data }, HttpStatus.FORBIDDEN);
  }
}

export class CannotReplyOnReplyCommentException extends ForbiddenException {
  constructor(commentId?: unknown) {
    super(FORBIDDEN_EXCEPTIONS.CANNOT_REPLY_ON_REPLY_COMMENT, `Cannot reply on reply comment ${commentId}`);
  }
}
