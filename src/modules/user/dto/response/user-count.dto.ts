import { ApiProperty } from '@nestjs/swagger';

export default class ResponseGetUserCountDto {
  @ApiProperty({ description: '총 유저수' })
  userCount: number;
}
