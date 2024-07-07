import { Inject, Injectable } from '@nestjs/common';
import User from '../domain/models/user.model';
import { UpdateUserDto } from '../dto/internal/update-user-info.dto';
import UserImageService from './user-image.service';
import { DuplicateNicknameException } from '../../../common/exceptions/409';
import ResponseGetUserInfoDto from '../dto/response/user-info.dto';
import * as UserMapper from '../mappers/user.mapper';
import { UserNotFoundException } from '../../../common/exceptions/404';
import CreateUserUseCase from '../use-cases/create-user.use-case';
import { CreateUserDto } from '../dto/internal/create-user.dto';
import { IUserRepository, USER_REPOSITORY, UserQueryFilter } from '../interfaces/user-repo.interface';

@Injectable()
export default class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userImageService: UserImageService,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(dto);
  }

  async getUserInfo(userId: string): Promise<ResponseGetUserInfoDto> {
    const user = await this.findOneOrThrow({ id: userId });
    return new ResponseGetUserInfoDto(UserMapper.toDto(user));
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.findOneOrThrow({ id: userId });

    if (dto?.profileImage) {
      const profileImage = await this.userImageService.getProfileImage(user, dto.profileImage);
      user.changeProfile(profileImage);
    }

    if (dto?.nickname) {
      if (user.getNickname() === dto.nickname) {
        return UserMapper.toDto(user);
      }

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
