import { ApiProperty, PickType } from '@nestjs/swagger';
import ArticleDto from './article.dto';
import CategorySummaryDto from '../../category/dto/category-summary.dto';
import TagDto from '../../tag/dto/tag.dto';

export default class ArticleSummaryDto extends PickType(ArticleDto, [
  'id',
  'thumbnail',
  'title',
  'content',
  'viewCount',
  'createdAt',
]) {
  constructor(builder: ArticleSummaryDtoBuilder) {
    super();
    this.id = builder.id;
    this.thumbnail = builder.thumbnail;
    this.title = builder.title;
    this.content = builder.content;
    this.viewCount = builder.viewCount;
    this.createdAt = builder.createdAt;
    this.category = builder.category;
    this.tags = builder.tags;
  }

  @ApiProperty({ description: '카테고리 정보', type: CategorySummaryDto })
  readonly category: CategorySummaryDto;

  @ApiProperty({ description: '태그 목록', type: [TagDto] })
  readonly tags: TagDto[];
}

export class ArticleSummaryDtoBuilder {
  id: string;
  thumbnail: string;
  title: string;
  content: string;
  viewCount: number;
  createdAt: Date;
  category: CategorySummaryDto;
  tags: TagDto[];

  setId(id: string): ArticleSummaryDtoBuilder {
    this.id = id;
    return this;
  }

  setThumbnail(thumbnail: string): ArticleSummaryDtoBuilder {
    this.thumbnail = thumbnail;
    return this;
  }

  setTitle(title: string): ArticleSummaryDtoBuilder {
    this.title = title;
    return this;
  }

  setContent(content: string): ArticleSummaryDtoBuilder {
    this.content = content;
    return this;
  }

  setViewCount(viewCount: number): ArticleSummaryDtoBuilder {
    this.viewCount = viewCount;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleSummaryDtoBuilder {
    this.createdAt = createdAt;
    return this;
  }

  setCategory(category: CategorySummaryDto): ArticleSummaryDtoBuilder {
    this.category = category;
    return this;
  }

  setTags(tags: TagDto[]): ArticleSummaryDtoBuilder {
    this.tags = tags;
    return this;
  }

  build(): ArticleSummaryDto {
    return new ArticleSummaryDto(this);
  }
}
