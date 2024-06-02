import { ApiProperty, PickType } from '@nestjs/swagger';
import UserRoles from '../../enums/user-role.enum';
import User from '../../domain/entities/user.entity';
import UserDto from '../user.dto';

export default class ResponseGetUserInfoDto extends PickType(UserDto, ['nickname', 'profile']) {
  constructor(user: User) {
    super();
    this.id = user.id;
    this.nickname = user.nickname;
    this.profile = user.profile;
    this.role = user.role.name;
  }

  @ApiProperty({ description: '유저 아이디', example: 'UUID' })
  id: string;

  @ApiProperty({ description: '유저 권한', example: UserRoles })
  role: string;

  static create(user: User): ResponseGetUserInfoDto {
    return new ResponseGetUserInfoDto(user);
  }
}
