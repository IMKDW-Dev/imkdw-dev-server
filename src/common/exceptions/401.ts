import { HttpException, HttpStatus } from '@nestjs/common';

export const UNAUTHORIZED_EXCEPTIONS = {
  INVALID_JWT_TOKEN: '401001',
  REFRESH_TOKEN_EXPIRED: '401002',
} as const;

class UnauthorizedException extends HttpException {
  constructor(message: string, error?: unknown) {
    super({ message, error }, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidJwtTokenException extends UnauthorizedException {
  constructor(cookie: string) {
    super(UNAUTHORIZED_EXCEPTIONS.INVALID_JWT_TOKEN, `Invalid refresh token of cookie, ${cookie}`);
  }
}

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor(refreshToken: string) {
    super(UNAUTHORIZED_EXCEPTIONS.REFRESH_TOKEN_EXPIRED, `Refresh token is expired, ${refreshToken}`);
  }
}
