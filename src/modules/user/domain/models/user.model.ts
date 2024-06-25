import Nickname from '../vo/nickname.vo';
import Profile from '../vo/profile.vo';
import UserId from '../vo/user-id.vo';
import UserOAuthProvider from './user-oauth-provider.model';
import UserRole from './user-role.model';

export default class User {
  constructor(
    id: UserId,
    email: string,
    nickname: Nickname,
    profile: Profile,
    oAuthProvider: UserOAuthProvider,
    role: UserRole,
  ) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
    this.profile = profile;
    this.oAuthProvider = oAuthProvider;
    this.role = role;
  }

  private id: UserId;
  private email: string;
  private nickname: Nickname;
  private profile: Profile;
  private oAuthProvider: UserOAuthProvider;
  private role: UserRole;

  getId(): string {
    return this.id.toString();
  }

  getNickname(): string {
    return this.nickname.toString();
  }

  getProfile(): string {
    return this.profile.toString();
  }

  getEmail(): string {
    return this.email;
  }

  getRoleId(): number {
    return this.role.getId();
  }

  getRole() {
    return this.role.toString();
  }

  getOAuthProviderId(): number {
    return this.oAuthProvider.getId();
  }

  isSignupWithOAuth(provider: UserOAuthProvider) {
    return this.oAuthProvider.equals(provider);
  }

  changeProfile(newProfileUrl: string) {
    this.profile = new Profile(newProfileUrl);
  }

  changeNickname(newNickname: string) {
    this.nickname = new Nickname(newNickname);
  }

  static builder = class {
    id: UserId;
    email: string;
    nickname: Nickname;
    profile: Profile;
    oAuthProvider: UserOAuthProvider;
    role: UserRole;

    setId(id: UserId) {
      this.id = id;
      return this;
    }

    setEmail(email: string) {
      this.email = email;
      return this;
    }

    setNickname(nickname: Nickname) {
      this.nickname = nickname;
      return this;
    }

    setProfile(profile: Profile) {
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
      return new User(
        this.id || new UserId(),
        this.email,
        this.nickname || new Nickname(),
        this.profile || new Profile(),
        this.oAuthProvider,
        this.role,
      );
    }
  };
}
