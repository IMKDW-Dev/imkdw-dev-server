import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../common/interfaces/use-case.interface';
import { CreateUserDto } from '../dto/internal/create-user.dto';
import User from '../domain/models/user.model';
import { IUserRepository, USER_REPOSITORY } from '../interfaces/user-repo.interface';
import { DuplicateEmailException } from '../../../common/exceptions/409';

@Injectable()
export default class CreateUserUseCase implements UseCase<CreateUserDto, User> {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existUser = await this.userRepository.findOne({ email: dto.email });
    if (existUser) {
      throw new DuplicateEmailException(`${dto.email}은 이미 사용중인 이메일입니다.`);
    }

    const user = new User.builder().setEmail(dto.email).setOAuthProvider(dto.oAuthProvider).build();
    return this.userRepository.save(user);
  }
}
