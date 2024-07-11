import { CannotReplyOnReplyCommentException } from '../../../../../common/exceptions/403';
import User from '../../../../user/domain/models/user.model';
import CommentContent from '../vo/article-comment-content.vo';

export default class Comment {
  private constructor(
    id: number,
    author: User,
    articleId: string,
    parentId: number | null,
    content: string,
    createdAt: Date,
    replies: Comment[],
  ) {
    this.id = id;
    this.author = author;
    this.articleId = articleId;
    this.parentId = parentId;
    this.content = new CommentContent(content);
    this.createdAt = createdAt;
    this.replies = replies;
  }

  private id: number;
  private author: User;
  private articleId: string;
  private parentId: number | null;
  private content: CommentContent;
  private createdAt: Date;
  private replies: Comment[];

  getId(): number {
    return this.id;
  }

  getAuthor(): User {
    return this.author;
  }

  getAuthorId(): string {
    return this.author.getId();
  }

  getArticleId(): string {
    return this.articleId;
  }

  getContent(): string {
    return this.content.toString();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getParentId(): number | null {
    return this.parentId;
  }

  getReplies(): Comment[] {
    return this.replies;
  }

  setParentId(parentId: number | null): void {
    this.parentId = parentId;
  }

  checkReplyAvailable() {
    if (this.parentId) {
      throw new CannotReplyOnReplyCommentException(`답글에는 답글을 작성할 수 없습니다. parentId: ${this.parentId}`);
    }
  }

  static builder = class {
    id: number;
    author: User;
    articleId: string;
    parentId: number | null;
    content: string;
    createdAt: Date;
    replies: Comment[];

    setId(id: number): this {
      this.id = id;
      return this;
    }

    setAuthor(author: User): this {
      this.author = author;
      return this;
    }

    setArticleId(articleId: string): this {
      this.articleId = articleId;
      return this;
    }

    setParentId(parentId: number | null): this {
      this.parentId = parentId;
      return this;
    }

    setContent(content: string): this {
      this.content = content;
      return this;
    }

    setCreatedAt(createdAt: Date): this {
      this.createdAt = createdAt;
      return this;
    }

    setReplies(replies: Comment[]): this {
      this.replies = replies;
      return this;
    }

    build(): Comment {
      return new Comment(
        this.id,
        this.author,
        this.articleId,
        this.parentId,
        this.content,
        this.createdAt,
        this.replies,
      );
    }
  };
}
