import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import User from '../../user/domain/entities/user.entity';
import IsCommentContent from '../decorators/validation/is-comment-content.decorator';

interface Props extends Partial<ArticleComment> {}

export default class ArticleComment {
  constructor(props: Props) {
    this.id = props.id;
    this.author = props.author;
    this.articleId = props.articleId;
    this.parentId = props.parentId;
    this.content = props.content;
    this.replies = props.replies ?? [];
    this.createdAt = props.createdAt;
  }

  @ApiProperty({ description: '댓글 아이디', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '댓글 작성자', type: User })
  author: User;

  @ApiProperty({ description: '게시글 아이디', example: 'UUID' })
  @IsString()
  articleId: string;

  @ApiProperty({ description: '부모 댓글 아이디', type: Number })
  @IsNumber()
  parentId: number | null;

  @ApiProperty({ description: '댓글 내용', example: '댓글 내용', minLength: 2, maxLength: 255 })
  @IsCommentContent()
  content: string;

  @ApiProperty({ description: '댓글 작성일' })
  createdAt: Date;

  @ApiProperty({ description: '답글 목록', type: [ArticleComment] })
  replies: ArticleComment[];

  isParentComment() {
    return !!this.parentId;
  }

  static create(props: Props): ArticleComment {
    return new ArticleComment(props);
  }
}
