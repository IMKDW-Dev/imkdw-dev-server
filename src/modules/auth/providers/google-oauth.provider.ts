import { Inject, Injectable } from '@nestjs/common';

import { HTTP_REST_SERVICE, HttpRestService } from '../../../infra/http/rest/interfaces/http-rest.interface';
import { GoogleOAuthUserInfo } from '../../../@types/auth/oauth/google.type';

@Injectable()
export default class GoogleOAuthProvider {
  private readonly GET_USER_INFO_API = 'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(@Inject(HTTP_REST_SERVICE) private readonly httpRestService: HttpRestService) {}

  async authenticate(accessToken: string): Promise<GoogleOAuthUserInfo> {
    return this.getUserInfo(accessToken);
  }

  private async getUserInfo(accessToken: string): Promise<GoogleOAuthUserInfo> {
    const response = await this.httpRestService.get<GoogleOAuthUserInfo>(this.GET_USER_INFO_API, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }
}
