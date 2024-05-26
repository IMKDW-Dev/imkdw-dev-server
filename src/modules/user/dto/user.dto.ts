import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UserDto {
  constructor(nickname: string, profile: string) {
    this.nickname = nickname;
    this.profile = profile;
  }

  @ApiProperty({ description: '닉네임' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: '프로필사진 URL' })
  @IsString()
  profile: string;
}
