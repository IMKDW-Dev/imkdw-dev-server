import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HTTP_REST_SERVICE, HttpRestService } from '../../../infra/http/rest/interfaces/http-rest.interface';
import { KakaoOAuthToken, KakaoUserInfo } from '../../../@types/auth/oauth/kakao.type';

@Injectable()
export default class KakaoOAuthProvider {
  private readonly GET_ACCESS_TOKEN_API = 'https://kauth.kakao.com/oauth/token';
  private readonly GET_USER_API = 'https://kapi.kakao.com/v2/user/me';
  private CLIENT_ID: string;

  constructor(
    @Inject(HTTP_REST_SERVICE) private readonly httpRestService: HttpRestService,
    private readonly configService: ConfigService,
  ) {
    this.CLIENT_ID = this.configService.get<string>('KAKAO_CLIENT_ID');
  }

  async authenticate(code: string, redirectUri: string): Promise<KakaoUserInfo> {
    const accessToken = await this.getAccessToken(code, redirectUri);
    return this.getUserInfo(accessToken);
  }

  private async getAccessToken(code: string, redirectUri: string): Promise<string> {
    const kakaoTokenResponse = await this.httpRestService.post<KakaoOAuthToken>(
      this.GET_ACCESS_TOKEN_API,
      {
        grant_type: 'authorization_code',
        client_id: this.CLIENT_ID,
        redirect_uri: redirectUri,
        code,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return kakaoTokenResponse.access_token;
  }

  private async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    return this.httpRestService.get<KakaoUserInfo>(this.GET_USER_API, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
