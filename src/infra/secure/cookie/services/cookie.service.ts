import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ICookieService } from '../interfaces/cookie.interface';
import { CookieMaxage } from '../enums/cookie.enum';
import { isProduction } from '../../../../common/functions/enviroment.function';

@Injectable()
export default class CookieService implements ICookieService {
  setCookie(key: string, value: string, maxAge: CookieMaxage, res: Response): void {
    res.cookie(key, value, {
      domain: process.env.COOKIE_DOMAIN,
      httpOnly: true,
      path: '/',
      secure: isProduction(),
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
