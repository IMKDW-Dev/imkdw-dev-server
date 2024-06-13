import { ApiProperty } from '@nestjs/swagger';

export default class ResponseGetUploadUrlDto {
  @ApiProperty({ description: '파일 업로드가 가능한 URL' })
  url: string;
}
