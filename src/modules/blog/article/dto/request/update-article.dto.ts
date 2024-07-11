import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import ArticleDto from '../article.dto';

export default class RequestUpdateArticleDto extends PickType(ArticleDto, ['title', 'content', 'visible', 'tags']) {
  @ApiProperty({ description: '게시글 썸네일', type: 'string', format: 'binary' })
  @IsOptional()
  thumbnail: Express.Multer.File;

  @ApiProperty({ description: '카테고리 아이디', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ description: '업로드된 이미지의 이름들', example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];
}
