import { Inject, Injectable } from '@nestjs/common';
import UserOAuthProvider from '../domain/models/user-oauth-provider.model';
import { IUserRepository, USER_REPOSITORY } from '../repository/user/user-repo.interface';
import User from '../domain/models/user.model';
import { UpdateUserDto } from '../dto/internal/update-user-info.dto';
import UserImageService from './user-image.service';
import { DuplicateNicknameException } from '../../../common/exceptions/409';
import UserRole from '../domain/models/user-role.model';
import ResponseGetUserInfoDto from '../dto/response/user-info.dto';
import * as UserMapper from '../mappers/user.mapper';
import { UserNotFoundException } from '../../../common/exceptions/404';
import { UserQueryFilter } from '../repository/user/user-query.filter';

@Injectable()
export default class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userImageService: UserImageService,
  ) {}

  async createUser(email: string, oAuthProvider: UserOAuthProvider): Promise<User> {
    const user = new User.builder().setEmail(email).setOAuthProvider(oAuthProvider).setRole(UserRole.NORMAL).build();
    return this.userRepository.save(user);
  }

  async getUserInfo(userId: string): Promise<ResponseGetUserInfoDto> {
    const user = await this.userRepository.findOne({ id: userId });
    return new ResponseGetUserInfoDto(UserMapper.toDto(user));
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.findOneOrThrow({ id: userId });

    if (dto?.profileImage) {
      const profileImage = await this.userImageService.getProfileImage(user, dto.profileImage);
      user.changeProfile(profileImage);
    }

    if (dto?.nickname) {
      const userByNickname = await this.userRepository.findOne({ nickname: dto.nickname });
      if (userByNickname) {
        throw new DuplicateNicknameException(`${dto.nickname}은 이미 사용중인 닉네임입니다.`);
      }

      user.changeNickname(dto.nickname);
    }

    const updatedUser = await this.userRepository.update(user);
    return UserMapper.toDto(updatedUser);
  }

  async findOneOrThrow(filter: UserQueryFilter) {
    const user = await this.userRepository.findOne(filter);
    if (!user) {
      throw new UserNotFoundException(`유저를 찾을 수 없습니다. ${JSON.stringify(filter)}`);
    }

    return user;
  }

  async getUserCount(): Promise<number> {
    return this.userRepository.count();
  }

  async findOne(filter: UserQueryFilter) {
    return this.userRepository.findOne(filter);
  }
}
