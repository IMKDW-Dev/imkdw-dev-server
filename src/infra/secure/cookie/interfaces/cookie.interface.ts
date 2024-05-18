import { Response } from 'express';
import { CookieMaxage } from '../enums/cookie.enum';

export const COOKIE_SERVICE = Symbol('COOKIE_SERVICE');

export interface ICookieService {
  setCookie(key: string, value: string, maxAge: CookieMaxage, res: Response): void;

  clearCookie(res: Response, cookies: string[]): void;
}
