import { ApiProperty, PickType } from '@nestjs/swagger';
import ArticleComment from '../domain/entities/article-comment.entity';
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
export default class ArticleCommentDto extends PickType(ArticleComment, ['id', 'articleId', 'content', 'createdAt']) {
  constructor(props: Props) {
    super();
    this.id = props.id;
    this.articleId = props.articleId;
    this.content = props.content;
    this.author = props.author;
    this.parentId = props.parentId;
    this.replies = props.replies;
  }

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
