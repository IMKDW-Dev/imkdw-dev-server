import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export enum OAuthProviders {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  GITHUB = 'github',
}

interface Props {
  id: number;
  provider: string;
}

export default class UserOAuthProvider {
  constructor(props: Props) {
    this.id = props.id;
    this.provider = props.provider;
  }

  @ApiProperty({ description: 'PK', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: `
    ${OAuthProviders.GOOGLE} : 구글
    ${OAuthProviders.KAKAO} : 카카오
    ${OAuthProviders.GITHUB} : 깃허브
    `,
    enum: OAuthProviders,
    example: OAuthProviders.GOOGLE,
  })
  provider: string;

  equals(provider: UserOAuthProvider): boolean {
    return this.provider === provider.provider;
  }

  static create(props: Props): UserOAuthProvider {
    return new UserOAuthProvider(props);
  }
}
