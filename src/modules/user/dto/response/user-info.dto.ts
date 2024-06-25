import { PickType } from '@nestjs/swagger';
import UserDto from '../user.dto';

export default class ResponseGetUserInfoDto extends PickType(UserDto, ['id', 'nickname', 'profile', 'role']) {
  constructor(user: UserDto) {
    super();
    this.id = user.id;
    this.nickname = user.nickname;
    this.profile = user.profile;
    this.role = user.role;
  }
}
