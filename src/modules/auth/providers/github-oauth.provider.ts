import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HTTP_REST_SERVICE, HttpRestService } from '../../../infra/http/rest/interfaces/http-rest.interface';
import { GithubOAuthToken } from '../../../@types/auth/oauth/github.type';
import { GithubUserInfo } from '../../../@types/auth/oauth/google.type';

@Injectable()
export default class GithubOAuthProvider {
  private readonly GET_ACCESS_TOKEN_API = 'https://github.com/login/oauth/access_token';
  private readonly GET_USER_API = 'https://api.github.com/user';
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;

  constructor(
    @Inject(HTTP_REST_SERVICE) private readonly httpRestService: HttpRestService,
    private readonly configService: ConfigService,
  ) {
    this.CLIENT_ID = this.configService.get<string>('GITHUB_CLIENT_ID');
    this.CLIENT_SECRET = this.configService.get<string>('GITHUB_CLIENT_SECRET');
  }

  async authenticate(code: string, redirectUri: string): Promise<GithubUserInfo> {
    const accessToken = await this.getAccessToken(code, redirectUri);
    return this.getUserInfo(accessToken);
  }

  private async getAccessToken(code: string, redirectUri: string): Promise<string> {
    const getTokenResponse = await this.httpRestService.post<GithubOAuthToken>(
      this.GET_ACCESS_TOKEN_API,
      {
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    return getTokenResponse.access_token;
  }

  private async getUserInfo(accessToken: string): Promise<GithubUserInfo> {
    return this.httpRestService.get<GithubUserInfo>(this.GET_USER_API, {
      headers: { Authorization: `token ${accessToken}` },
    });
  }
}
