import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

import CategoryDto from '../../category/dto/category.dto';
import TagDto from '../../tag/dto/tag.dto';
import IsArticleId from '../decorators/validation/is-article-id.decorator';
import IsArticleTitle from '../decorators/validation/is-article-title.decorator';
import IsArticleContent from '../decorators/validation/is-article-content.decorator';
import CommentDto from '../../comment/dto/comment.dto';

export default class ArticleDto {
  constructor(
    id: string,
    title: string,
    content: string,
    visible: boolean,
    thumbnail: string | Express.Multer.File,
    viewCount: number,
    commentCount: number,
    createdAt: Date,
    category: CategoryDto,
    tags: TagDto[],
    comments: CommentDto[],
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.visible = visible;
    this.thumbnail = thumbnail;
    this.viewCount = viewCount;
    this.commentCount = commentCount;
    this.createdAt = createdAt;
    this.category = category;
    this.tags = tags;
    this.comments = comments;
  }

  @ApiProperty({
    description: '게시글 아이디',
    example: 'how-to-use-nestjs-ani213ijoasds',
    minLength: 2,
    maxLength: 245,
  })
  @IsArticleId()
  id: string;

  @ApiProperty({ description: '제목', example: 'NestJS 사용법', minLength: 2, maxLength: 255 })
  @IsArticleTitle()
  title: string;

  @ApiProperty({ description: '내용', minLength: 2, maxLength: 65000 })
  @IsArticleContent()
  content: string;

  @ApiProperty({ description: '게시글 공개 여부', example: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  visible: boolean;

  @ApiProperty({ description: '썸네일', example: 'https://image.com/article.png' })
  thumbnail: string | Express.Multer.File;

  @ApiProperty({ description: '조회수', example: 0 })
  viewCount: number;

  @ApiProperty({ description: '댓글 수', example: 0 })
  commentCount: number;

  @ApiProperty({ description: '생성일', example: new Date() })
  createdAt: Date;

  @ApiProperty({ description: '카테고리', type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ description: '태그 목록', type: [TagDto] })
  tags: TagDto[];

  @ApiProperty({ description: '댓글 목록', type: [CommentDto] })
  comments: CommentDto[];

  static builder = class {
    id: string;
    title: string;
    content: string;
    visible: boolean;
    thumbnail: string | Express.Multer.File;
    viewCount: number;
    commentCount: number;
    createdAt: Date;
    category: CategoryDto;
    tags: TagDto[];
    comments: CommentDto[];

    setId(id: string) {
      this.id = id;
      return this;
    }

    setTitle(title: string) {
      this.title = title;
      return this;
    }

    setContent(content: string) {
      this.content = content;
      return this;
    }

    setVisible(visible: boolean) {
      this.visible = visible;
      return this;
    }

    setThumbnail(thumbnail: string | Express.Multer.File) {
      this.thumbnail = thumbnail;
      return this;
    }

    setViewCount(viewCount: number) {
      this.viewCount = viewCount;
      return this;
    }

    setCommentCount(commentCount: number) {
      this.commentCount = commentCount;
      return this;
    }

    setCreatedAt(createdAt: Date) {
      this.createdAt = createdAt;
      return this;
    }

    setCategory(category: CategoryDto) {
      this.category = category;
      return this;
    }

    setTags(tags: TagDto[]) {
      this.tags = tags;
      return this;
    }

    setComments(comments: CommentDto[]) {
      this.comments = comments;
      return this;
    }

    build() {
      return new ArticleDto(
        this.id,
        this.title,
        this.content,
        this.visible,
        this.thumbnail,
        this.viewCount,
        this.commentCount,
        this.createdAt,
        this.category,
        this.tags,
        this.comments,
      );
    }
  };
}
