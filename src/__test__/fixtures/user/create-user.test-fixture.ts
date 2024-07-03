import UserOAuthProvider from '../../../modules/user/domain/models/user-oauth-provider.model';
import User from '../../../modules/user/domain/models/user.model';

interface Params {
  id?: string;
  provider: UserOAuthProvider;
}

// eslint-disable-next-line import/prefer-default-export
export const createUser = (params: Params) => {
  return new User.builder().setId(params.id).setOAuthProvider(params.provider).build();
};
