import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import OAuthService from '../services/oauth.service';
import * as Swagger from '../docs/oauth.swagger';
import Authorization from '../../../common/decorators/authorization.decorator';
import { COOKIE_SERVICE, ICookieService } from '../../../infra/secure/cookie/interfaces/cookie.interface';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/token.constant';
import { CookieMaxage } from '../../../infra/secure/cookie/enums/cookie.enum';
import ResponseAuthResultDto from '../dto/response/auth-result.dto';
import { Public } from '../decorators/public.decorator';
import ReqeustKakaoOAuthDto from '../dto/request/kakao-oauth.dto';
import ReqeustGithubOAuthDto from '../dto/request/github-oauth.dto';

@ApiTags('[인증] 소셜로그인')
@Controller({ path: 'oauth', version: '1' })
export default class OAuthController {
  constructor(
    private readonly oAuthService: OAuthService,
    @Inject(COOKIE_SERVICE) private readonly cookieService: ICookieService,
  ) {}

  @Swagger.googleOAuth('구글 소셜로그인')
  @Public()
  @Post('google')
  async googleOAuth(
    @Authorization() authorization: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseAuthResultDto> {
    const authResult = await this.oAuthService.googleOAuth(authorization);
    this.setCookie(res, authResult);
    return { userId: authResult.userId };
  }

  @Swagger.kakaoOAuth('카카오 소셜로그인')
  @Public()
  @Post('kakao')
  async kakaoOAuth(
    @Body() body: ReqeustKakaoOAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseAuthResultDto> {
    const authResult = await this.oAuthService.kakaoOAuth(body.code, body.redirectUri);

    this.setCookie(res, authResult);
    return { userId: authResult.userId };
  }

  @Swagger.githubOAuth('깃허브 소셜로그인')
  @Post('github')
  async githubOAuth(
    @Body() body: ReqeustGithubOAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseAuthResultDto> {
    const authResult = await this.oAuthService.githubOAuth(body.code, body.redirectUri);
    this.setCookie(res, authResult);
    return { userId: authResult.userId };
  }

  private setCookie(res: Response, { accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
    this.cookieService.setCookie(ACCESS_TOKEN_KEY, accessToken, CookieMaxage.HOUR_1, res);
    this.cookieService.setCookie(REFRESH_TOKEN_KEY, refreshToken, CookieMaxage.DAY_30, res);
  }
}
