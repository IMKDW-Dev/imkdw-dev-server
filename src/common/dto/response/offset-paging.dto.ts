import { ApiProperty } from '@nestjs/swagger';

export default class ResponseOffsetPagingDto {
  @ApiProperty({ description: '총 페이지의 수', example: 99 })
  totalPage: number;

  @ApiProperty({ description: '다음 페이지 존재여부', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: '이전 페이지 존재여부', example: true })
  hasPreviousPage: boolean;

  @ApiProperty({ description: '데이터 목록', type: 'array', items: { type: 'object' } })
  items: unknown[];
}
