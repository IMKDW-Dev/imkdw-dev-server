import { Inject, Injectable } from '@nestjs/common';
import User from '../domain/models/user.model';
import { UpdateUserDto } from '../dto/internal/update-user.dto';
import * as UserMapper from '../mappers/user.mapper';
import CreateUserUseCase from '../use-cases/create-user.use-case';
import { CreateUserDto } from '../dto/internal/create-user.dto';
import { IUserRepository, USER_REPOSITORY, UserQueryFilter } from '../interfaces/user-repo.interface';
import UpdateUserUseCase from '../use-cases/update-user.use-case';
import GetUserInfoUseCase from '../use-cases/get-user-info.use-case';
import UserDto from '../dto/user.dto';

@Injectable()
export default class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserInfoUseCase: GetUserInfoUseCase,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(dto);
  }

  async getUserInfo(userId: string): Promise<UserDto> {
    const user = await this.getUserInfoUseCase.execute({ userId });
    return UserMapper.toDto(user);
  }

  async updateUser(dto: UpdateUserDto): Promise<UserDto> {
    const updatedUser = await this.updateUserUseCase.execute(dto);
    return UserMapper.toDto(updatedUser);
  }

  async getUserCount(): Promise<number> {
    return this.userRepository.count();
  }

  async findOne(filter: UserQueryFilter) {
    return this.userRepository.findOne(filter);
  }
}
