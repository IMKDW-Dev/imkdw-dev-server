import { ApiProperty, PickType } from '@nestjs/swagger';
import UserDto from '../../user/dto/user.dto';

class CommentUserDto extends PickType(UserDto, ['nickname', 'profile']) {
  constructor(nickname: string, profile: string) {
    super();
    this.nickname = nickname;
    this.profile = profile;
  }
}

export default class ArticleCommentDetailDto {
  constructor(id: number, content: string, author: UserDto, replies: ArticleCommentDetailDto[], createdAt: Date) {
    this.id = id;
    this.content = content;
    this.author = author;
    this.replies = replies;
    this.createdAt = createdAt;
  }

  @ApiProperty({ description: '댓글 ID' })
  id: number;

  @ApiProperty({ description: '댓글 내용' })
  content: string;

  @ApiProperty({ description: '작성자 정보', type: CommentUserDto })
  author: CommentUserDto;

  @ApiProperty({ description: '답글 목록', type: [ArticleCommentDetailDto] })
  replies: ArticleCommentDetailDto[];

  @ApiProperty({ description: '댓글 작성일' })
  createdAt: Date;
}
