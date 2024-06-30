import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsUrl } from 'class-validator';

import IsNickname from '../decorators/validation/is-nickname.decorator';
import { userRoles } from '../domain/models/user-role.model';

export default class UserDto {
  constructor(id: string, nickname: string, profile: string, role: string) {
    this.id = id;
    this.nickname = nickname;
    this.profile = profile;
    this.role = role;
  }

  @ApiProperty({ description: '유저 아이디', example: 'UUID' })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: '닉네임',
    example: 'imkdw',
    minLength: 2,
    maxLength: 8,
  })
  @IsNickname()
  nickname: string;

  @ApiProperty({ description: '프로필사진 URL', example: 'https://temp.com/profile.jpg' })
  @IsUrl()
  profile: string;

  @ApiProperty({ description: '유저 권한', example: userRoles.normal.name })
  @IsEnum([userRoles.admin.name, userRoles.normal.name])
  role: string;
}
