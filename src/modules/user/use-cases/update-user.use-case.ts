import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../common/interfaces/use-case.interface';
import User from '../domain/models/user.model';
import { IUserRepository, USER_REPOSITORY } from '../interfaces/user-repo.interface';
import { UpdateUserDto } from '../dto/internal/update-user.dto';
import UserImageService from '../services/user-image.service';
import { DuplicateNicknameException } from '../../../common/exceptions/409';
import { UserNotFoundException } from '../../../common/exceptions/404';

@Injectable()
export default class UpdateUserUseCase implements UseCase<UpdateUserDto, User> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userImageService: UserImageService,
  ) {}

  async execute(dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ id: dto.userId });
    if (!user) {
      throw new UserNotFoundException(`유저를 찾을 수 없습니다. ${JSON.stringify(dto)}`);
    }

    await this.updateProfiile(user, dto?.profileImage);
    await this.updateNickname(user, dto?.nickname);
    return this.userRepository.update(user);
  }

  private async updateProfiile(user: User, profileImage: Express.Multer.File) {
    if (!profileImage) {
      return;
    }

    const profileImageUrl = await this.userImageService.getProfileImage(user, profileImage);
    user.changeProfile(profileImageUrl);
  }

  private async updateNickname(user: User, nickname: string) {
    if (!nickname || user.getNickname() === nickname) {
      return;
    }

    const userByNickname = await this.userRepository.findOne({ nickname });
    if (userByNickname) {
      throw new DuplicateNicknameException(`${nickname}은 이미 사용중인 닉네임입니다.`);
    }

    user.changeNickname(nickname);
  }
}
