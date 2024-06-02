import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export default class RequestOffsetPagingDto {
  @ApiProperty({ description: '조회할 데이터의 개수', type: Number, minimum: 1, maximum: 50 })
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({ description: '조회중인 페이지', type: Number, minimum: 1 })
  @IsNumber()
  @Type(() => Number)
  page: number;
}
