import { ApiProperty } from '@nestjs/swagger';
import UserDto from '../../user/dto/user.dto';

export default class ArticleCommentDto {
  constructor(
    id: number,
    articleId: string,
    content: string,
    createdAt: Date,
    author: UserDto,
    replies: ArticleCommentDto[],
  ) {
    this.id = id;
    this.articleId = articleId;
    this.content = content;
    this.createdAt = createdAt;
    this.author = author;
    this.replies = replies;
  }

  @ApiProperty({ description: '댓글 아이디', example: 1, type: Number })
  id: number;

  @ApiProperty({ description: '게시글 아이디', example: 'UUID' })
  articleId: string;

  @ApiProperty({ description: '댓글 내용', example: '댓글 내용', minLength: 2, maxLength: 255 })
  content: string;

  @ApiProperty({ description: '댓글 작성일' })
  createdAt: Date;

  @ApiProperty({ description: '댓글 작성자', type: UserDto })
  author: UserDto;

  @ApiProperty({ description: '답글 목록', type: [ArticleCommentDto] })
  replies: ArticleCommentDto[];
}
