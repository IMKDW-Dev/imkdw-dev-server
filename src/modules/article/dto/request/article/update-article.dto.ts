import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import ArticleDto from '../../article.dto';

export default class RequestUpdateArticleDto extends PartialType(
  PickType(ArticleDto, ['title', 'content', 'visible', 'tags']),
) {
  @ApiProperty({ description: '게시글 썸네일', type: 'string', format: 'binary' })
  @IsOptional()
  thumbnail: Express.Multer.File;

  @ApiProperty({ description: '카테고리 아이디', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  categoryId: number;
}
