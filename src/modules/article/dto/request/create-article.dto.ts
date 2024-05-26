import { ApiProperty, PickType } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsString } from 'class-validator';
import ArticleDto from '../article.dto';

export default class RequestCreateArticleDto extends PickType(ArticleDto, [
  'id',
  'title',
  'categoryId',
  'content',
  'visible',
]) {
  @ApiProperty({ description: '태그 목록', maxLength: 3 })
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @ApiProperty({ description: '게시글 썸네일', type: 'string', format: 'binary' })
  thumbnail: Express.Multer.File;
}
