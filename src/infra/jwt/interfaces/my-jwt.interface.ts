export const MY_JWT_SERVICE = Symbol('MY_JWT_SERVICE');
export interface IMyJwtService {
  sign(userId: string, expiresIn: string): string;
  verify(token: string): { userId: string };
}
