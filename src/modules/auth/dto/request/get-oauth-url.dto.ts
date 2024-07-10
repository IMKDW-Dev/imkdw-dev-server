import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import OAuthProvider from '../../enums/oauth-provider.enum';

export default class RequestGetOAuthUrlQuery {
  @ApiProperty({ name: 'provider', description: '소셜 로그인 제공자', enum: OAuthProvider })
  @IsEnum(OAuthProvider)
  provider: OAuthProvider;
}
