import User from '../domain/entities/user.entity';
import UserDto from '../dto/user.dto';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (user: User) =>
  UserDto.create({
    nickname: user.nickname,
    profile: user.profile,
  });
