import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import UserQueryService from '../../user/services/user-query.service';
import { DuplicateEmailException } from '../../../common/exceptions/409';
import AuthService from './auth.service';
import UserOAuthQueryService from '../../user/services/user-oauth-query.service';
import { OAuthProviders } from '../../user/domain/models/user-oauth-provider.model';
import { HTTP_REST_SERVICE, IHttpRestService } from '../../../infra/http/rest/interfaces/http-rest.interface';
import { GithubUserInfo, GoogleOAuthUserInfo } from '../../../@types/auth/oauth/google.type';
import { KakaoOAuthToken, KakaoUserInfo } from '../../../@types/auth/oauth/kakao.type';
import { GithubOAuthToken } from '../../../@types/auth/oauth/github.type';

@Injectable()
export default class OAuthService {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userOAuthProviderQueryService: UserOAuthQueryService,
    private readonly authService: AuthService,
    @Inject(HTTP_REST_SERVICE) private readonly httpRestService: IHttpRestService,
    private readonly configService: ConfigService,
  ) {}

  async googleOAuth(accessToken: string) {
    const GET_USER_INFO_API = 'https://www.googleapis.com/oauth2/v2/userinfo';

    const userInfo = await this.httpRestService.get<GoogleOAuthUserInfo>(GET_USER_INFO_API, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return this.handleOAuth(OAuthProviders.GOOGLE, userInfo.email);
  }

  async kakaoOAuth(code: string, redirectUri: string) {
    const GET_ACCESS_TOKEN_API = 'https://kauth.kakao.com/oauth/token';
    const GET_USER_API = 'https://kapi.kakao.com/v2/user/me';

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

    const userInfo = await this.httpRestService.get<KakaoUserInfo>(GET_USER_API, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${kakaoTokenResponse.access_token}`,
      },
    });

    return this.handleOAuth(OAuthProviders.KAKAO, userInfo.kakao_account.email);
  }

  async githubOAuth(code: string, redirectUri: string) {
    const GET_ACCESS_TOKEN_API = 'https://github.com/login/oauth/access_token';
    const GET_USER_API = 'https://api.github.com/user';

    const getTokenResponse = await this.httpRestService.post<GithubOAuthToken>(
      GET_ACCESS_TOKEN_API,
      {
        client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
        client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
        code,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const userInfo = await this.httpRestService.get<GithubUserInfo>(GET_USER_API, {
      headers: { Authorization: `token ${getTokenResponse.access_token}` },
    });

    return this.handleOAuth(OAuthProviders.GITHUB, userInfo.email);
  }

  private async handleOAuth(provider: OAuthProviders, email: string) {
    const userByEmail = await this.userQueryService.findOne({ email });
    const userOAuthProvider = await this.userOAuthProviderQueryService.findOne({ name: provider });

    if (userByEmail && userByEmail.isSignupWithOAuth(userOAuthProvider)) {
      return this.authService.login(userByEmail.id);
    }

    if (userByEmail) {
      throw new DuplicateEmailException();
    }

    return this.authService.register(email, userOAuthProvider);
  }
}
