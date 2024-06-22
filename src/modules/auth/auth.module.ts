import { Module } from '@nestjs/common';

import UserModule from '../user/user.module';
import HttpRestModule from '../../infra/http/rest/http-rest.module';
import OAuthService from './services/oauth.service';
import OAuthController from './controllers/oauth.controller';
import AuthService from './services/auth.service';
import CookieModule from '../../infra/secure/cookie/cookie.module';
import AuthController from './controllers/auth.controller';
import TokenModule from '../token/token.module';

@Module({
  imports: [UserModule, HttpRestModule, CookieModule, TokenModule],
  controllers: [OAuthController, AuthController],
  providers: [OAuthService, AuthService],
})
export default class AuthModule {}
