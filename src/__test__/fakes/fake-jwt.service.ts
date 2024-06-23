/* eslint-disable @typescript-eslint/no-unused-vars */

import { IMyJwtService } from '../../infra/jwt/interfaces/my-jwt.interface';

export default class FakeJwtService implements IMyJwtService {
  sign(userId: string, expiresIn: string): string {
    return '';
  }

  verify(token: string): { userId: string } {
    return { userId: '' };
  }
}
