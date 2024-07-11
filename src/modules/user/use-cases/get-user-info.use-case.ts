import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../common/interfaces/use-case.interface';
import User from '../domain/models/user.model';
import { IUserRepository, USER_REPOSITORY } from '../interfaces/user-repo.interface';
import { GetUserInfoDto } from '../dto/internal/get-user-info.dto';
import { UserNotFoundException } from '../../../common/exceptions/404';

@Injectable()
export default class GetUserInfoUseCase implements UseCase<GetUserInfoDto, User> {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async execute(userId: GetUserInfoDto): Promise<User> {
    const user = await this.userRepository.findOne({ id: userId.userId });
    if (!user) {
      throw new UserNotFoundException(`유저를 찾을 수 없습니다. userId: ${userId.userId}`);
    }

    return user;
  }
}
