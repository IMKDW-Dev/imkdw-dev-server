import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { GetArticleSort } from '../../enums/article.enum';

export default class GetArticlesQuery {
  @ApiProperty({ description: '게시글 조회 필터', enum: GetArticleSort })
  @IsEnum(GetArticleSort)
  sort: GetArticleSort;

  @ApiProperty({ description: '조회할 게시글 개수', example: 3 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;

  @ApiProperty({ description: '카테고리 아이디', required: false, example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  categoryId: number;

  @ApiProperty({ description: '조회에서 제외할 게시글 아이디', required: false, example: 'how-to-use-nextjs' })
  @IsString()
  @IsOptional()
  excludeId: string;
}
