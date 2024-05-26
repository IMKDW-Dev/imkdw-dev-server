import { ApiProperty, PickType } from '@nestjs/swagger';
import ArticleDto from './article.dto';
import TagDto from '../../tag/dto/tag.dto';
import ArticleCommentDetailDto from '../../article-comment/dto/article-comment-detail.dto';

export default class ArticleDetailDto extends PickType(ArticleDto, [
  'id',
  'title',
  'content',
  'viewCount',
  'createdAt',
]) {
  constructor(builder: ArticleDetailDtoBuilder) {
    super();
    this.tags = builder.tags;
    this.comments = builder.comments;
  }

  @ApiProperty({ description: '태그 목록', type: [TagDto] })
  tags: TagDto[];

  @ApiProperty({ description: '댓글 목록', type: [ArticleCommentDetailDto] })
  comments: ArticleCommentDetailDto[];
}

export class ArticleDetailDtoBuilder extends PickType(ArticleDto, [
  'id',
  'title',
  'content',
  'viewCount',
  'createdAt',
]) {
  tags: TagDto[];
  comments: ArticleCommentDetailDto[];

  setId(id: string): ArticleDetailDtoBuilder {
    this.id = id;
    return this;
  }

  setTitle(title: string): ArticleDetailDtoBuilder {
    this.title = title;
    return this;
  }

  setContent(content: string): ArticleDetailDtoBuilder {
    this.content = content;
    return this;
  }

  setViewCount(viewCount: number): ArticleDetailDtoBuilder {
    this.viewCount = viewCount;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleDetailDtoBuilder {
    this.createdAt = createdAt;
    return this;
  }

  setTags(tags: TagDto[]): ArticleDetailDtoBuilder {
    this.tags = tags;
    return this;
  }

  setComments(comments: ArticleCommentDetailDto[]): ArticleDetailDtoBuilder {
    this.comments = comments;
    return this;
  }

  build(): ArticleDetailDto {
    return new ArticleDetailDto(this);
  }
}
