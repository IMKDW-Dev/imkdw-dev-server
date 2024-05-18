import { ApiProperty } from '@nestjs/swagger';
import User from '../../domain/entities/user.entity';
import UserRoles from '../../enums/user-role.enum';

export default class ResponseGetUserInfoDto {
  constructor(userId: string, nickname: string, profile: string, role: string) {
    this.userId = userId;
    this.nickname = nickname;
    this.profile = profile;
    this.role = role;
  }

  @ApiProperty({ description: '유저 아이디' })
  private userId: string;

  @ApiProperty({ description: '유저 닉네임' })
  private nickname: string;

  @ApiProperty({ description: '유저 프로필 이미지' })
  private profile: string;

  @ApiProperty({ description: '유저 권한', example: UserRoles })
  private role: string;

  static toDto(user: User) {
    return new ResponseGetUserInfoDto(user.getId(), user.getNickname(), user.getProfile(), user.getRole().getName());
  }
}
