import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DuplicateEmailException } from '../../../common/exceptions/409';
import AuthService from './auth.service';
import { HTTP_REST_SERVICE, IHttpRestService } from '../../../infra/http/rest/interfaces/http-rest.interface';
import { GithubUserInfo, GoogleOAuthUserInfo } from '../../../@types/auth/oauth/google.type';
import { KakaoOAuthToken, KakaoUserInfo } from '../../../@types/auth/oauth/kakao.type';
import { GithubOAuthToken } from '../../../@types/auth/oauth/github.type';
import UserOAuthProvider from '../../user/domain/models/user-oauth-provider.model';
import UserService from '../../user/services/user.service';

@Injectable()
export default class OAuthService {
  constructor(
    @Inject(HTTP_REST_SERVICE) private readonly httpRestService: IHttpRestService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async googleOAuth(accessToken: string) {
    const GET_USER_INFO_API = this.configService.get<string>('GOOGLE_GET_USER_INFO_API');
    const userInfo = await this.httpRestService.get<GoogleOAuthUserInfo>(GET_USER_INFO_API, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return this.handleOAuth(UserOAuthProvider.GOOGLE, userInfo.email);
  }

  async kakaoOAuth(code: string, redirectUri: string) {
    const GET_ACCESS_TOKEN_API = this.configService.get<string>('KAKAO_GET_ACCESS_TOKEN_API');
    const GET_USER_INFO_API = this.configService.get<string>('KAKAO_GET_USER_INFO_API');

    const kakaoTokenResponse = await this.httpRestService.post<KakaoOAuthToken>(
      GET_ACCESS_TOKEN_API,
      {
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('KAKAO_CLIENT_ID'),
        redirect_uri: redirectUri,
        code,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const userInfo = await this.httpRestService.get<KakaoUserInfo>(GET_USER_INFO_API, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${kakaoTokenResponse.access_token}`,
      },
    });

    return this.handleOAuth(UserOAuthProvider.KAKAO, userInfo.kakao_account.email);
  }

  async githubOAuth(code: string, redirectUri: string) {
    const GET_ACCESS_TOKEN_API = this.configService.get<string>('OAUTH_GITHUB_GET_ACCESS_TOKEN_API');
    const GET_USER_INFO_API = this.configService.get<string>('OAUTH_GITHUB_GET_USER_INFO_API');

    const getTokenResponse = await this.httpRestService.post<GithubOAuthToken>(
      GET_ACCESS_TOKEN_API,
      {
        client_id: this.configService.get<string>('OAUTH_GITHUB_CLIENT_ID'),
        client_secret: this.configService.get<string>('OAUTH_GITHUB_CLIENT_SECRET'),
        code,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const userInfo = await this.httpRestService.get<GithubUserInfo>(GET_USER_INFO_API, {
      headers: { Authorization: `token ${getTokenResponse.access_token}` },
    });

    return this.handleOAuth(UserOAuthProvider.GITHUB, userInfo.email);
  }

  private async handleOAuth(provider: UserOAuthProvider, email: string) {
    const userByEmail = await this.userService.findOne({ email });
    if (userByEmail && userByEmail.isSignupWithOAuth(provider)) {
      return this.authService.login(userByEmail.getId());
    }

    if (userByEmail) {
      throw new DuplicateEmailException(`${email}은 이미 사용중인 이메일입니다.`);
    }

    return this.authService.register(email, provider);
  }
}
