import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

import IsNickname from '../decorators/validation/is-nickname.decorator';

interface Props {
  nickname: string;
  profile: string;
}
export default class UserDto {
  constructor(props: Props) {
    this.nickname = props.nickname;
    this.profile = props.profile;
  }

  @ApiProperty({
    description: `
    유저 닉네임
    1. 특수문자 사용불가
    2. 공백 사용불가
    3. 2자 이상, 8자 이하
    4. 한글, 영문, 숫자 사용가능
  `,
    example: 'imkdw',
    minLength: 2,
    maxLength: 8,
  })
  @IsNickname()
  nickname: string;

  @ApiProperty({ description: '유저 프로필사진 URL', example: 'https://temp.com/profile.jpg' })
  @IsUrl()
  profile: string;

  static create(props: Props) {
    return new UserDto(props);
  }
}
