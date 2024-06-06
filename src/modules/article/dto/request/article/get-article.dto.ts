import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { GetArticleSort } from '../../../enums/article.enum';
import RequestOffsetPagingDto from '../../../../../common/dto/request/offset-paging.dto';

export default class GetArticlesQuery extends RequestOffsetPagingDto {
  @ApiProperty({ description: '게시글 조회 필터', enum: GetArticleSort })
  @IsEnum(GetArticleSort)
  sort: GetArticleSort;

  @ApiProperty({ description: '카테고리 아이디', required: false, example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  categoryId: number;

  @ApiProperty({ description: '조회에서 제외할 게시글 아이디', required: false, example: 'how-to-use-nextjs' })
  @IsString()
  @IsOptional()
  excludeId: string;

  @ApiProperty({ description: '검색어', required: false, example: 'nestjs' })
  @IsString()
  @IsOptional()
  search: string;
}
