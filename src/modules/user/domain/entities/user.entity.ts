import { generateCUID } from '../../../../common/utils/cuid';
import { generateUUID } from '../../../../common/utils/uuid';
import UserDto from '../../dto/user.dto';
import UserOAuthProvider from './user-oauth-provider.entity';
import UserRole from './user-role.entity';

export default class User {
  private static readonly NICKNAME_MAX_LENGTH = 21;

  private id: string;
  private email: string;
  private nickname: string;
  private profile: string;
  private oAuthProvider: UserOAuthProvider;
  private role: UserRole;

  constructor(builder: UserBuilder) {
    this.id = builder.id;
    this.email = builder.email;
    this.nickname = builder.nickname;
    this.profile = builder.profile;
    this.oAuthProvider = builder.oAuthProvider;
    this.role = builder.role;
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getNickname(): string {
    return this.nickname;
  }

  getProfile(): string {
    return this.profile;
  }

  getOAuthProvider(): UserOAuthProvider {
    return this.oAuthProvider;
  }

  getRole(): UserRole {
    return this.role;
  }

  setDefaultProfile() {
    this.profile = 'https://static.imkdw.dev/images/default_profile.png';
  }

  setDefaultNickname() {
    this.nickname = generateCUID();
  }

  isSignupWithOAuthProvider(oAuthProvider: UserOAuthProvider) {
    return this.oAuthProvider.equals(oAuthProvider);
  }

  generateId() {
    this.id = generateUUID();
  }

  toDto(): UserDto {
    return new UserDto(this.nickname, this.profile);
  }
}

export class UserBuilder {
  id: string;
  email: string;
  nickname: string;
  profile: string;
  oAuthProvider: UserOAuthProvider;
  role: UserRole;

  setId(id: string) {
    this.id = id;
    return this;
  }

  setEmail(email: string) {
    this.email = email;
    return this;
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
    return this;
  }

  setProfile(profile: string) {
    this.profile = profile;
    return this;
  }

  setOAuthProvider(oAuthProvider: UserOAuthProvider) {
    this.oAuthProvider = oAuthProvider;
    return this;
  }

  setRole(role: UserRole) {
    this.role = role;
    return this;
  }

  build() {
    return new User(this);
  }
}
