import { ApiProperty, PickType } from '@nestjs/swagger';
import UserDto from '../../user/dto/user.dto';

export class CommentUserDto extends PickType(UserDto, ['nickname', 'profile']) {
  constructor(nickname: string, profile: string) {
    super();
    this.nickname = nickname;
    this.profile = profile;
  }
}

export default class ArticleCommentDetailDto {
  constructor(builder: ArticleCommentDetailDtoBuilder) {
    this.id = builder.id;
    this.content = builder.content;
    this.author = new CommentUserDto();
    this.replies = builder.replies;
    this.createdAt = builder.createdAt;
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

export class ArticleCommentDetailDtoBuilder {
  id: number;
  content: string;
  author: string;
  replies: ArticleCommentDetailDto[];
  createdAt: Date;

  setId(id: number): ArticleCommentDetailDtoBuilder {
    this.id = id;
    return this;
  }

  setContent(content: string): ArticleCommentDetailDtoBuilder {
    this.content = content;
    return this;
  }

  setAuthor(author: string): ArticleCommentDetailDtoBuilder {
    this.author = author;
    return this;
  }

  setReplies(replies: ArticleCommentDetailDto[]): ArticleCommentDetailDtoBuilder {
    this.replies = replies;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleCommentDetailDtoBuilder {
    this.createdAt = createdAt;
    return this;
  }

  build(): ArticleCommentDetailDto {
    return new ArticleCommentDetailDto(this);
  }
}
