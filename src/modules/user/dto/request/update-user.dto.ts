import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import UserDto from '../user.dto';

export default class RequestUpdateUserDto extends PickType(UserDto, ['nickname']) {
  @ApiProperty({ description: '프로필 이미지', required: false, type: 'string', format: 'binary' })
  @IsOptional()
  profileImage?: Express.Multer.File;
}
