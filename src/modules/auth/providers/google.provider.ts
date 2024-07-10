import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOAuthProvider } from './oauth-provider.interface';

@Injectable()
export default class GoogleProvider implements IOAuthProvider {
  constructor(private readonly configService: ConfigService) {  }

  getLoginUrl(): string {
    const LOGIN_URL = this.configService.get<string>('GOOGLE_LOGIN_URL');
    const CALLBACK_URL = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    let url = LOGIN_URL;
    url += `?client_id=${this.CLIENT_ID}`;
    url += `&response_type=code`;
    url += `&redirect_uri=${}`;
    return url;
  }
}
