import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

import ArticleDto from '../../article.dto';

export default class RequestCreateArticleDto extends PickType(ArticleDto, ['id', 'title', 'content', 'visible']) {
  @ApiProperty({ description: '게시글 아이디', example: 'how-to-use-nestjs', minLength: 2, maxLength: 245 })
  @ApiProperty({ description: '카테고리 아이디', example: 1 })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ description: '태그 목록', maxLength: 3 })
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @ApiProperty({ description: '게시글 썸네일', type: 'string', format: 'binary' })
  thumbnail: Express.Multer.File;

  @ApiProperty({ description: '업로드된 이미지의 이름들', example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];
}
