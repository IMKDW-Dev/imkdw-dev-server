import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const googleOAuth = (summary: string) => applyDecorators(ApiOperation({ summary }));

export const kakaoOAuth = (summary: string) => applyDecorators(ApiOperation({ summary }));

export const githubOAuth = (summary: string) => applyDecorators(ApiOperation({ summary }));
