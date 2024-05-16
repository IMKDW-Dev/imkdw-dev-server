import { Inject } from '@nestjs/common';
import { IUserOAuthRepository, USER_OAUTH_REPOSITORY } from '../repository/oauth-provider/user-oauth-repo.interface';
import { UserOauthProviderQueryFilter } from '../repository/oauth-provider/user-oauth-provider-query.filter';

export default class UserOAuthQueryService {
  constructor(@Inject(USER_OAUTH_REPOSITORY) private readonly userOAuthRepository: IUserOAuthRepository) {}

  async findOne(filter: UserOauthProviderQueryFilter) {
    return this.userOAuthRepository.findOne(filter);
  }
}
