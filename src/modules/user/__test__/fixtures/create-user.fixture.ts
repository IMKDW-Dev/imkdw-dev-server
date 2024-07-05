import { generateUUID } from '../../../../common/utils/uuid';
import UserOAuthProvider from '../../domain/models/user-oauth-provider.model';
import UserRole from '../../domain/models/user-role.model';
import User from '../../domain/models/user.model';

interface Params {
  id?: string;
  email?: string;
  profile?: string;
  nickname?: string;
  userRole?: UserRole;
  provider?: UserOAuthProvider;
}

// eslint-disable-next-line import/prefer-default-export
export const createUser = (params?: Params) => {
  return new User.builder()
    .setId(params?.id ?? generateUUID())
    .setEmail(params?.email ?? 'dummy_email')
    .setProfile(params?.profile ?? 'dummy_profile')
    .setNickname(params?.nickname ?? 'dummy_nickname')
    .setRole(params?.userRole ?? UserRole.NORMAL)
    .setOAuthProvider(params?.provider ?? UserOAuthProvider.GOOGLE)
    .build();
};
