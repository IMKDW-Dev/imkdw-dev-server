export const oAuthProviders = {
  google: { id: 1, provider: 'google' },
  github: { id: 2, provider: 'github' },
  kakao: { id: 3, provider: 'kakao' },
} as const;

export default class UserOAuthProvider {
  constructor(id: number, provider: string) {
    this.id = id;
    this.provider = provider;
    this.validate();
  }

  private validate() {
    if (!Object.values(oAuthProviders).find((provider) => provider.id === this.id)) {
      throw new Error(`Invalid OAuth provider id: ${this.id}`);
    }
  }

  private id: number;
  private provider: string;

  getId(): number {
    return this.id;
  }

  equals(provider: UserOAuthProvider): boolean {
    return this.provider === provider.provider;
  }

  static GOOGLE = new UserOAuthProvider(oAuthProviders.google.id, oAuthProviders.google.provider);
  static GITHUB = new UserOAuthProvider(oAuthProviders.github.id, oAuthProviders.github.provider);
  static KAKAO = new UserOAuthProvider(oAuthProviders.kakao.id, oAuthProviders.kakao.provider);
}
