import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import ResponseGetUploadUrlDto from '../dto/response/get-upload-url.dto';

// eslint-disable-next-line import/prefer-default-export
export const getUploadUrl = (summary: string) =>
  applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: ResponseGetUploadUrlDto }));
