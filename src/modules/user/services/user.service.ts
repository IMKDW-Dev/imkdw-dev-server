import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserBuilder } from '../domain/entities/user.entity';
import UserOAuthProvider from '../domain/entities/user-oauth-provider.entity';
import { IUserRoleRepository, USER_ROLE_REPOSITORY } from '../repository/role/user-role-repo.interface';
import { IUserRepository, USER_REPOSITORY } from '../repository/user/user-repo.interface';
import UserRoles from '../enums/user-role.enum';
import ResponseGetUserInfoDto from '../dto/response/user-info.dto';

@Injectable()
export default class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepository: IUserRoleRepository,
  ) {}

  async createUser(email: string, profile: string, oAuthProvider: UserOAuthProvider) {
    const userRole = await this.userRoleRepository.findOne({ name: UserRoles.NORMAL });
    const newUser = new UserBuilder().setEmail(email).setOAuthProvider(oAuthProvider).setRole(userRole).build();
    newUser.generateId();
    newUser.setDefaultProfile();
    newUser.setDefaultNickname();
    return this.userRepository.save(newUser);
  }

  async getUserInfo(requestUserId: string, userId: string): Promise<ResponseGetUserInfoDto> {
    if (requestUserId !== userId) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({ id: userId });
    return ResponseGetUserInfoDto.toDto(user);
  }
}
