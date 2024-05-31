import { ApiProperty, PickType } from '@nestjs/swagger';
import UserRoles from '../../enums/user-role.enum';
import User from '../../domain/entities/user.entity';

export default class ResponseGetUserInfoDto extends PickType(User, ['id', 'nickname', 'profile']) {
  constructor(user: User) {
    super();
    this.role = user.role.name;
  }

  @ApiProperty({ description: '유저 권한', example: UserRoles })
  role: string;

  static create(user: User): ResponseGetUserInfoDto {
    return new ResponseGetUserInfoDto(user);
  }
}
