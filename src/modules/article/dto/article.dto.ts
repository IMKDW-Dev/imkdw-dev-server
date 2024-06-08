import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

import CategoryDto from '../../category/dto/category.dto';
import TagDto from '../../tag/dto/tag.dto';
import ArticleCommentDto from './article-comment.dto';
import IsArticleId from '../decorators/validation/is-article-id.decorator';
import IsArticleTitle from '../decorators/validation/is-article-title.decorator';
import IsArticleContent from '../decorators/validation/is-article-content.decorator';

interface Props {
  id: string;
  title: string;
  category: CategoryDto;
  content: string;
  visible: boolean;
  thumbnail: string;
  viewCount: number;
  commentCount: number;
  createdAt: Date;
  tags: TagDto[];
  comments: ArticleCommentDto[];
}

export default class ArticleDto {
  constructor(props: Props) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.visible = props.visible;
    this.thumbnail = props.thumbnail;
    this.viewCount = props.viewCount;
    this.commentCount = props.commentCount;
    this.createdAt = props.createdAt;
    this.category = props.category;
    this.tags = props.tags;
    this.comments = props.comments;
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

  @ApiProperty({ description: '댓글 목록', type: [ArticleCommentDto] })
  comments: ArticleCommentDto[];

  static create(props: Props) {
    return new ArticleDto(props);
  }
}
