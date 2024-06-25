import { userOAuthProviders, userRoles, users } from '@prisma/client';
import User from '../domain/models/user.model';
import UserId from '../domain/vo/user-id.vo';
import Nickname from '../domain/vo/nickname.vo';
import Profile from '../domain/vo/profile.vo';
import UserRole from '../domain/models/user-role.model';
import UserOAuthProvider from '../domain/models/user-oauth-provider.model';

// eslint-disable-next-line import/prefer-default-export
export const toModel = (user: users, role: userRoles, oAuthProvider: userOAuthProviders): User =>
  new User.builder()
    .setId(new UserId(user.id))
    .setEmail(user.email)
    .setNickname(new Nickname(user.nickname))
    .setProfile(new Profile(user.profile))
    .setOAuthProvider(new UserOAuthProvider(oAuthProvider.id, oAuthProvider.name))
    .setRole(new UserRole(role.id, role.name))
    .build();
