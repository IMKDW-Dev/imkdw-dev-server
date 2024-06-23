export enum OAuthProviders {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  GITHUB = 'github',
}

interface Props extends Partial<UserOAuthProvider> {}

export default class UserOAuthProvider {
  constructor(props: Props) {
    this.id = props.id;
    this.provider = props.provider;
  }

  id: number;
  provider: string;

  equals(provider: UserOAuthProvider): boolean {
    return this.provider === provider.provider;
  }

  static create(props: Props): UserOAuthProvider {
    return new UserOAuthProvider(props);
  }
}
