import { userOAuthProviders, userRoles, users } from '@prisma/client';
import User from '../domain/models/user.model';
import UserRole from '../domain/models/user-role.model';
import UserOAuthProvider from '../domain/models/user-oauth-provider.model';
import UserDto from '../dto/user.dto';

export const toModel = (user: users, role: userRoles, oAuthProvider: userOAuthProviders): User =>
  new User.builder()
    .setId(user.id)
    .setEmail(user.email)
    .setNickname(user.nickname)
    .setProfile(user.profile)
    .setOAuthProvider(new UserOAuthProvider(oAuthProvider.id, oAuthProvider.name))
    .setRole(new UserRole(role.id, role.name))
    .build();

export const toDto = (user: User): UserDto => {
  return new UserDto(user.getId(), user.getNickname(), user.getProfile(), user.getRole());
};
