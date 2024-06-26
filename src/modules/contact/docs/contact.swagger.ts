import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

// eslint-disable-next-line import/prefer-default-export
export const createContact = (summary: string) => applyDecorators(ApiOperation({ summary }));
