import UserOAuthProvider from '../../domain/models/user-oauth-provider.model';

export interface CreateUserDto {
  email: string;
  oAuthProvider: UserOAuthProvider;
}
