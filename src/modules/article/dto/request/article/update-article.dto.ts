import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import ArticleDto from '../../article.dto';

export default class RequestUpdateArticleDto extends PartialType(
  PickType(ArticleDto, ['title', 'content', 'visible', 'tags']),
) {
  @ApiProperty({ description: '게시글 썸네일', type: 'string', format: 'binary' })
  @IsOptional()
  thumbnailImage: Express.Multer.File;
}
