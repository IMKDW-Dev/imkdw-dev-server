import { ApiProperty } from '@nestjs/swagger';

export default class ResponseAuthResultDto {
  @ApiProperty({ description: '유저 아이디' })
  userId: string;
}
