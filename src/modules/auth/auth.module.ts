import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import UserModule from '../user/user.module';
import GoogleOAuthProvider from './providers/google-oauth.provider';
import HttpRestModule from '../../infra/http/rest/http-rest.module';
import OAuthService from './services/oauth.service';
import OAuthController from './controllers/oauth.controller';
import KakaoOAuthProvider from './providers/kakao-oauth.provider';
import GithubOAuthProvider from './providers/github-oauth.provider';
import AuthService from './services/auth.service';
import { MY_JWT_SERVICE } from '../../infra/secure/jwt/interfaces/my-jwt.interface';
import MyJwtService from '../../infra/secure/jwt/services/my-jwt.service';

@Module({
  imports: [UserModule, HttpRestModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    GoogleOAuthProvider,
    KakaoOAuthProvider,
    GithubOAuthProvider,
    AuthService,
    {
      provide: MY_JWT_SERVICE,
      useClass: MyJwtService,
    },
  ],
})
export default class AuthModule {}
