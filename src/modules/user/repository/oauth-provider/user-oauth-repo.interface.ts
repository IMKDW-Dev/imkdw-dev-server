import UserOAuth from '../../domain/models/user-oauth-provider.model';
import { UserOauthProviderQueryFilter } from './user-oauth-provider-query.filter';

export const USER_OAUTH_REPOSITORY = Symbol('USER_OAUTH_REPOSITORY');

export interface IUserOAuthRepository {
  findOne(filter: UserOauthProviderQueryFilter): Promise<UserOAuth | null>;
}
