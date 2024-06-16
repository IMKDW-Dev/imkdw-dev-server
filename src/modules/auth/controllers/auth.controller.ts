import { Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import * as Swagger from '../docs/auth.swagger';
import { Public } from '../decorators/public.decorator';
import Cookie from '../../../common/decorators/cookie.decorator';
import AuthService from '../services/auth.service';
import { COOKIE_SERVICE, ICookieService } from '../../../infra/secure/cookie/interfaces/cookie.interface';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/token.constant';
import { CookieMaxage } from '../../../infra/secure/cookie/enums/cookie.enum';

@Controller({ path: 'auth', version: '1' })
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(COOKIE_SERVICE) private readonly cookieService: ICookieService,
  ) {}

  @Swagger.refreshToken('토큰 갱신')
  @Public()
  @Post('refresh-token')
  refresh(@Cookie() cookie: string, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.refreshToken(cookie);
    this.cookieService.setCookie(ACCESS_TOKEN_KEY, accessToken, CookieMaxage.HOUR_1, res);
  }

  @Swagger.logout('로그아웃')
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearCookie(res, [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }
}
