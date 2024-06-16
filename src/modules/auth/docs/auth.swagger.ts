import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const refreshToken = (summary: string) => applyDecorators(ApiOperation({ summary }));

export const logout = (summary: string) => applyDecorators(ApiOperation({ summary }));
