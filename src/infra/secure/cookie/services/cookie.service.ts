import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ICookieService } from '../interfaces/cookie.interface';
import { CookieMaxage } from '../enums/cookie.enum';

@Injectable()
export default class CookieService implements ICookieService {
  private readonly IS_SECURE = process.env.NODE_ENV === 'production';
  setCookie(key: string, value: string, maxAge: CookieMaxage, res: Response): void {
    res.cookie(key, value, {
      domain: process.env.COOKIE_DOMAIN,
      httpOnly: true,
      path: '/',
      secure: this.IS_SECURE,
      maxAge,
      sameSite: 'lax',
    });
  }

  clearCookie(res: Response, cookies: string[]) {
    cookies.forEach((cookie) => {
      res.clearCookie(cookie, {
        domain: process.env.COOKIE_DOMAIN,
      });
    });
  }
}
