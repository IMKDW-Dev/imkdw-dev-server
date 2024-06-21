import { Module } from '@nestjs/common';

import UserModule from '../user/user.module';
import GoogleOAuthProvider from './providers/google-oauth.provider';
import HttpRestModule from '../../infra/http/rest/http-rest.module';
import OAuthService from './services/oauth.service';
import OAuthController from './controllers/oauth.controller';
import KakaoOAuthProvider from './providers/kakao-oauth.provider';
import GithubOAuthProvider from './providers/github-oauth.provider';
import AuthService from './services/auth.service';
import CookieModule from '../../infra/secure/cookie/cookie.module';
import AuthController from './controllers/auth.controller';
import TokenModule from '../token/token.module';

@Module({
  imports: [UserModule, HttpRestModule, CookieModule, TokenModule],
  controllers: [OAuthController, AuthController],
  providers: [OAuthService, GoogleOAuthProvider, KakaoOAuthProvider, GithubOAuthProvider, AuthService],
})
export default class AuthModule {}
