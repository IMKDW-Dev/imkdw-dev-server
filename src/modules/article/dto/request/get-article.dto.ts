import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';

import { GetArticleFilter } from '../../enums/article.enum';

export default class GetArticlesQuery {
  @ApiProperty({ description: '게시글 조회 필터', enum: GetArticleFilter })
  @IsEnum(GetArticleFilter)
  filter: GetArticleFilter;

  @ApiProperty({ description: '조회할 게시글 개수', example: 3 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;
}
