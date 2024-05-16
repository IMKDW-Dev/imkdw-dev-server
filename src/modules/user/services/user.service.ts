import { Inject, Injectable } from '@nestjs/common';
import { UserBuilder } from '../domain/entities/user.entity';
import UserOAuthProvider from '../domain/entities/user-oauth-provider.entity';
import { IUserRoleRepository, USER_ROLE_REPOSITORY } from '../repository/role/user-role-repo.interface';
import { IUserRepository, USER_REPOSITORY } from '../repository/user/user-repo.interface';
import UserRoles from '../enums/user-role.enum';

@Injectable()
export default class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepository: IUserRoleRepository,
  ) {}

  async createUser(email: string, profile: string, oAuthProvider: UserOAuthProvider) {
    const userRole = await this.userRoleRepository.findOne({ name: UserRoles.NORMAL });
    const newUser = new UserBuilder().setEmail(email).setOAuthProvider(oAuthProvider).setRole(userRole).build();
    newUser.setDefaultProfile();
    newUser.setDefaultNickname();
    return this.userRepository.save(newUser);
  }
}
