import { InjectionToken } from '@nestjs/common';

export type JwtTokenType = 'access' | 'refresh';

export const MY_JWT_SERVICE: InjectionToken = Symbol('MY_JWT_SERVICE');
export interface IMyJwtService {
  generateToken(type: JwtTokenType, userId: string): string;
  verify(token: string): string;
}
