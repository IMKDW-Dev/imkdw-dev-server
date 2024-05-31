import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsUrl } from 'class-validator';

import IsArticleId from '../../decorators/validation/is-article-id.decorator';
import ArticleId from '../value-objects/article-id.vo';
import IsArticleTitle from '../../decorators/validation/is-article-title.decorator';
import Category from '../../../category/domain/entities/category.entity';
import IsArticleContent from '../../decorators/validation/is-article-content.decorator';

interface Props {
  id?: ArticleId;
  title?: string;
  category?: Category;
  content?: string;
  visible?: boolean;
  thumbnail?: string;
  viewCount?: number;
  commentCount?: number;
  createdAt?: Date;
}

export default class Article {
  constructor(props: Props) {
    this.id = props.id;
    this.title = props.title;
    this.category = props.category;
    this.content = props.content;
    this.visible = props.visible;
    this.thumbnail = props.thumbnail;
    this.viewCount = props.viewCount;
    this.commentCount = props.commentCount;
    this.createdAt = props.createdAt;
  }

  @ApiProperty({ description: '게시글 아이디', example: 'how-to-use-nestjs', minLength: 1, maxLength: 245 })
  @IsArticleId()
  @Type(() => ArticleId)
  id: ArticleId;

  @ApiProperty({ description: '게시글 제목', example: 'NestJS 사용법', maxLength: 255 })
  @IsArticleTitle()
  title: string;

  @ApiProperty({ description: '카테고리', type: Category })
  category: Category;

  @ApiProperty({ description: '게시글 내용', example: 'NestJS 사용법에 대한 설명', minLength: 1, maxLength: 65000 })
  @IsArticleContent()
  content: string;

  @ApiProperty({ description: '게시글 노출 여부', example: true, type: Boolean })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  visible: boolean;

  @ApiProperty({ description: '게시글 썸네일 URL', example: 'https://example.com/image.jpg' })
  @IsUrl()
  thumbnail: string;

  @ApiProperty({ description: '게시글 조회수', example: 0, type: Number })
  @IsNumber()
  @Type(() => Number)
  viewCount: number;

  @ApiProperty({ description: '게시글 댓글 수', example: 0, type: Number })
  @IsNumber()
  @Type(() => Number)
  commentCount: number;

  @ApiProperty({ description: '게시글 작성일', example: '2021-08-01T00:00:00.000Z', type: Date })
  @Type(() => Date)
  createdAt: Date;

  addCommentCount() {
    this.commentCount += 1;
  }

  addHashOnId() {
    this.id.addHash();
  }

  static create(props: Props): Article {
    return new Article(props);
  }
}
