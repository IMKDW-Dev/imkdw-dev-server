import { ApiProperty, PickType } from '@nestjs/swagger';
import ArticleDto from './article.dto';
import Tag from '../../tag/domain/entities/tag.entity';
import TagDto from '../../tag/dto/tag.dto';

export default class ArticleDetailDto extends PickType(ArticleDto, [
  'id',
  'title',
  'content',
  'createdAt',
  'thumbnail',
]) {
  constructor(
    id: string,
    title: string,
    content: string,
    tags: TagDto[],
    comments: any[],
    createdAt: Date,
    thumbnail: string,
  ) {
    super();
    this.id = id;
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.comments = comments;
    this.createdAt = createdAt;
    this.thumbnail = thumbnail;
  }

  @ApiProperty({ description: '태그 목록', type: [TagDto] })
  tags: TagDto[];

  @ApiProperty({ description: '댓글 목록' })
  comments: any[];
}
