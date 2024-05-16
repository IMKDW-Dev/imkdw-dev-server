export default class UserOAuthProvider {
  private id: number;
  private provider: string;
  constructor(id: number, provider: string) {
    this.id = id;
    this.provider = provider;
  }

  getId() {
    return this.id;
  }

  equals(oAuthProvider: UserOAuthProvider) {
    return this.provider === oAuthProvider.provider;
  }
}
