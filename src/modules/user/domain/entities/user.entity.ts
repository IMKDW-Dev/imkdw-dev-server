import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl } from 'class-validator';

import UserOAuthProvider from './user-oauth-provider.entity';
import UserRole from './user-role.entity';
import IsNickname from '../../decorators/validation/is-nickname.decorator';
import { generateCUID } from '../../../../common/utils/cuid';
import { generateUUID } from '../../../../common/utils/uuid';

interface UserProps {
  id?: string;
  email?: string;
  nickname?: string;
  profile?: string;
  oAuthProvider?: UserOAuthProvider;
  role?: UserRole;
}

export default class User {
  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.nickname = props.nickname;
    this.profile = props.profile;
    this.oAuthProvider = props.oAuthProvider;
    this.role = props.role;
  }

  @ApiProperty({ description: '유저 아이디', example: 'UUID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '유저 이메일', example: 'imkdw@kakao.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `
    유저 닉네임
    1. 특수문자 사용불가
    2. 공백 사용불가
    3. 2자 이상, 22자 이하
    4. 한글, 영문, 숫자 사용가능
  `,
    example: 'imkdw',
    minLength: 2,
    maxLength: 22,
  })
  @IsNickname()
  nickname: string;

  @ApiProperty({ description: '유저 프로필사진 URL', example: 'https://temp.com/profile.jpg' })
  @IsUrl()
  profile: string;

  @ApiProperty({ description: 'OAuth 제공사 정보', type: UserOAuthProvider })
  oAuthProvider: UserOAuthProvider;

  @ApiProperty({ description: '유저 권한 정보', type: UserRole })
  role: UserRole;

  setDefaultProfile() {
    this.profile = 'https://static.imkdw.dev/images/default_profile.png';
  }

  setDefaultNickname() {
    this.nickname = generateCUID();
  }

  generateId() {
    this.id = generateUUID();
  }

  isSignupWithOAuth(provider: UserOAuthProvider) {
    return this.oAuthProvider.equals(provider);
  }

  static create(props: UserProps) {
    return new User(props);
  }
}
