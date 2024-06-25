import { Inject, Injectable } from '@nestjs/common';
import UserOAuthProvider from '../domain/models/user-oauth-provider.model';
import { IUserRoleRepository, USER_ROLE_REPOSITORY } from '../repository/role/user-role-repo.interface';
import { IUserRepository, USER_REPOSITORY } from '../repository/user/user-repo.interface';
import UserRoles from '../enums/user-role.enum';
import ResponseGetUserInfoDto from '../dto/response/user-info.dto';
import User from '../domain/models/user.model';
import { UpdateUserInfoDto } from '../dto/internal/update-user-info.dto';
import UserImageService from './user-image.service';
import { DuplicateNicknameException } from '../../../common/exceptions/409';
import * as UserMapper from '../mappers/user.mapper';

@Injectable()
export default class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepository: IUserRoleRepository,
    private readonly userImageService: UserImageService,
  ) {}

  async createUser(email: string, oAuthProvider: UserOAuthProvider) {
    const userRole = await this.userRoleRepository.findOne({ name: UserRoles.NORMAL });
    const newUser = User.create({ email, oAuthProvider, role: userRole });
    return this.userRepository.save(newUser);
  }

  async getUserInfo(userId: string): Promise<ResponseGetUserInfoDto> {
    const user = await this.userRepository.findOne({ id: userId });
    return ResponseGetUserInfoDto.create(user);
  }

  async updateUserInfo(userId: string, dto: UpdateUserInfoDto) {
    const user = await this.userRepository.findOne({ id: userId });

    if (dto?.profileImage) {
      const profileImage = await this.userImageService.getProfileImage(user, dto.profileImage);
      user.changeProfile(profileImage);
    }

    if (dto?.nickname) {
      const userByNickname = await this.userRepository.findOne({ nickname: dto.nickname });
      if (userByNickname) {
        throw new DuplicateNicknameException(dto.nickname);
      }

      user.changeNickname(dto.nickname);
    }

    const updatedRow = await this.userRepository.update(userId, user);
    return UserMapper.toDto(updatedRow);
  }

  async getUserCount(): Promise<number> {
    return this.userRepository.count();
  }
}
