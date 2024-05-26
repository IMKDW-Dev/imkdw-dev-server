import User from '../../../user/domain/entities/user.entity';
import ArticleCommentDetailDto from '../../dto/article-comment-detail.dto';

export default class ArticleCommentDetail {
  constructor(builder: ArticleCommentDetailBuilder) {
    this.id = builder.id;
    this.replies = builder.replies;
    this.author = builder.author;
    this.content = builder.content;
    this.createdAt = builder.createdAt;
  }

  private id: number;
  private replies: ArticleCommentDetail[];
  private author: User;
  private content: string;
  private createdAt: Date;

  toDto(): ArticleCommentDetailDto {
    return new ArticleCommentDetailDto(
      this.id,
      this.content,
      this.author.toDto(),
      this.replies.map((reply) => reply.toDto()),
      this.createdAt,
    );
  }
}

export class ArticleCommentDetailBuilder {
  id: number;
  replies: ArticleCommentDetail[];
  author: User;
  content: string;
  createdAt: Date;

  setId(id: number): ArticleCommentDetailBuilder {
    this.id = id;
    return this;
  }

  setReplies(replies: ArticleCommentDetail[]): ArticleCommentDetailBuilder {
    this.replies = replies;
    return this;
  }

  setAuthor(author: User): ArticleCommentDetailBuilder {
    this.author = author;
    return this;
  }

  setContent(content: string): ArticleCommentDetailBuilder {
    this.content = content;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleCommentDetailBuilder {
    this.createdAt = createdAt;
    return this;
  }

  build(): ArticleCommentDetail {
    return new ArticleCommentDetail(this);
  }
}
