import { ApiProperty } from '@nestjs/swagger';

import UserOAuthProvider from './user-oauth-provider.entity';
import UserRole from './user-role.entity';
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

  id: string;
  email: string;
  nickname: string;
  profile: string;

  @ApiProperty({ description: 'OAuth 제공사 정보', type: UserOAuthProvider })
  oAuthProvider: UserOAuthProvider;

  @ApiProperty({ description: '유저 권한 정보', type: UserRole })
  role: UserRole;

  setDefaultProfile() {
    this.profile = 'https://static.imkdw.dev/images/default_profile.png';
  }

  setDefaultNickname() {
    this.nickname = generateCUID().slice(0, 8);
  }

  generateId() {
    this.id = generateUUID();
  }

  isSignupWithOAuth(provider: UserOAuthProvider) {
    return this.oAuthProvider.equals(provider);
  }

  changeProfile(profile: string) {
    this.profile = profile;
  }

  changeNickname(nickname: string) {
    this.nickname = nickname;
  }

  static create(props: UserProps) {
    return new User(props);
  }
}
