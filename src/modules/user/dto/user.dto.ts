import { PickType } from '@nestjs/swagger';
import User from '../domain/entities/user.entity';

interface Props {
  nickname: string;
  profile: string;
}
export default class UserDto extends PickType(User, ['nickname', 'profile']) {
  constructor(props: Props) {
    super();
    this.nickname = props.nickname;
    this.profile = props.profile;
  }

  static create(props: Props) {
    return new UserDto(props);
  }
}
