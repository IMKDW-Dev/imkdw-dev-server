import { ApiProperty } from '@nestjs/swagger';
import UserDto from '../../user/dto/user.dto';

interface Props {
  id: number;
  articleId: string;
  content: string;
  author: UserDto;
  parentId: number | null;
  replies: ArticleCommentDto[];
  createdAt: Date;
}
export default class ArticleCommentDto {
  constructor(props: Props) {
    this.id = props.id;
    this.articleId = props.articleId;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.author = props.author;
    this.parentId = props.parentId;
    this.replies = props.replies;
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

  @ApiProperty({ description: '부모 댓글 아이디', nullable: true })
  parentId: number | null;

  @ApiProperty({ description: '답글 목록', type: [ArticleCommentDto] })
  replies: ArticleCommentDto[];

  static create(props: Props) {
    return new ArticleCommentDto(props);
  }
}
