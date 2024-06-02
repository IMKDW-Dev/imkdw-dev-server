import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import RequestCreateCommentDto from '../dto/request/create-comment.dto';

// eslint-disable-next-line import/prefer-default-export
export const createComment = (summary: string) =>
  applyDecorators(ApiOperation({ summary }), ApiBody({ type: RequestCreateCommentDto }));
