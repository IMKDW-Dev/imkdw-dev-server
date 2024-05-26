import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString, MaxLength } from 'class-validator';

const ARTICLE_ID_MAX_LENGTH = 231;
const ARTICLE_TITLE_MAX_LENGTH = 255;
const ARTICLE_CONTENT_MAX_LENGTH = 50000;

export default class ArticleDto {
  constructor(builder?: ArticleDtoBuilder) {
    this.id = builder.id;
    this.title = builder.title;
    this.categoryId = builder.categoryId;
    this.content = builder.content;
    this.visible = builder.visible;
    this.thumbnail = builder.thumbnail;
    this.viewCount = builder.viewCount;
    this.commentCount = builder.commentCount;
    this.createdAt = builder.createdAt;
  }

  @ApiProperty({
    description: '게시글 아이디, 생성시 마지막에 24자리의 CUID가 추가됨',
    example: 'how-to-leave-office-early',
    maxLength: ARTICLE_ID_MAX_LENGTH,
  })
  @IsString()
  @MaxLength(ARTICLE_ID_MAX_LENGTH)
  id: string;

  @ApiProperty({
    description: '게시글 제목',
    example: '퇴근 빨리하는 방법을 공유합니다.',
    maxLength: ARTICLE_TITLE_MAX_LENGTH,
  })
  @IsString()
  @MaxLength(ARTICLE_TITLE_MAX_LENGTH)
  title: string;

  @ApiProperty({ description: '게시글 카테고리 아이디', example: 1 })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: '게시글 내용',
    example: '퇴근 빨리하는 방법을 공유합니다.',
    maxLength: ARTICLE_CONTENT_MAX_LENGTH,
  })
  @IsString()
  @MaxLength(ARTICLE_CONTENT_MAX_LENGTH)
  content: string;

  @ApiProperty({ description: '게시글 공개 여부', example: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  visible: boolean;

  @ApiProperty({ description: '게시글 썸네일 이미지 URL', example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  thumbnail: string;

  @ApiProperty({ description: '조회수', example: 100 })
  @IsNumber()
  @Type(() => Number)
  viewCount: number;

  @ApiProperty({ description: '댓글 수', example: 10 })
  @IsNumber()
  @Type(() => Number)
  commentCount: number;

  @ApiProperty({ description: '게시글 작성일' })
  @IsDate()
  createdAt: Date;
}

export class ArticleDtoBuilder {
  id: string;
  title: string;
  categoryId: number;
  content: string;
  visible: boolean;
  thumbnail: string;
  viewCount: number;
  commentCount: number;
  createdAt: Date;

  setId(id: string): ArticleDtoBuilder {
    this.id = id;
    return this;
  }

  setTitle(title: string): ArticleDtoBuilder {
    this.title = title;
    return this;
  }

  setCategoryId(categoryId: number): ArticleDtoBuilder {
    this.categoryId = categoryId;
    return this;
  }

  setContent(content: string): ArticleDtoBuilder {
    this.content = content;
    return this;
  }

  setVisible(visible: boolean): ArticleDtoBuilder {
    this.visible = visible;
    return this;
  }

  setThumbnail(thumbnail: string): ArticleDtoBuilder {
    this.thumbnail = thumbnail;
    return this;
  }

  setViewCount(viewCount: number): ArticleDtoBuilder {
    this.viewCount = viewCount;
    return this;
  }

  setCommentCount(commentCount: number): ArticleDtoBuilder {
    this.commentCount = commentCount;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleDtoBuilder {
    this.createdAt = createdAt;
    return this;
  }

  build(): ArticleDto {
    return new ArticleDto(this);
  }
}
