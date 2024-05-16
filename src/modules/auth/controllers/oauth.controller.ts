import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import OAuthService from '../services/oauth.service';
import * as Swagger from '../docs/oauth.swagger';
import Authorization from '../../../common/decorators/authorization.decorator';
import { ReqeustKakaoOAuthDto } from '../dto/request/kakao-oauth.dto';
import { ReqeustGithubOAuthDto } from '../dto/request/github-oauth.dto';

@ApiTags('[인증] 소셜로그인')
@Controller({ path: 'oauth', version: '1' })
export default class OAuthController {
  constructor(private readonly oAuthService: OAuthService) {}

  @Swagger.googleOAuth('구글 소셜로그인')
  @Post('google')
  async googleOAuth(@Authorization() authorization: string) {
    return this.oAuthService.googleOAuth(authorization);
  }

  @Swagger.kakaoOAuth('카카오 소셜로그인')
  @Post('kakao')
  async kakaoOAuth(@Body() body: ReqeustKakaoOAuthDto) {
    return this.oAuthService.kakaoOAuth(body.code, body.redirectUri);
  }

  @Swagger.githubOAuth('깃허브 소셜로그인')
  @Post('github')
  async githubOAuth(@Body() body: ReqeustGithubOAuthDto) {
    return this.oAuthService.githubOAuth(body.code, body.redirectUri);
  }
}
