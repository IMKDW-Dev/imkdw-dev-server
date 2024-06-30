import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UNAUTHORIZED_EXCEPTIONS } from '../../../common/exceptions/401';

export const refreshToken = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiUnauthorizedResponse({
      description: `
      ${UNAUTHORIZED_EXCEPTIONS.INVALID_JWT_TOKEN} : 리프레쉬 토큰이 없거나 올바르지 않은 경우
      ${UNAUTHORIZED_EXCEPTIONS.REFRESH_TOKEN_EXPIRED} : 리프레쉬 토큰이 만료된 경우
    `,
    }),
  );

export const logout = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({
      headers: {
        'Clear-Cookie': {
          description: '토큰이 설정된 쿠키 삭제',
        },
      },
    }),
  );
