import { CannotReplyOnReplyCommentException } from '../../../../common/exceptions/403';
import User from '../../../user/domain/models/user.model';

export default class ArticleComment {
  constructor(
    id: number,
    author: User,
    articleId: string,
    parent: ArticleComment,
    content: string,
    createdAt: Date,
    replies: ArticleComment[],
  ) {
    this.id = id;
    this.author = author;
    this.articleId = articleId;
    this.parent = parent;
    this.content = content;
    this.createdAt = createdAt;
    this.replies = replies;
  }

  private id: number;
  private author: User;
  private articleId: string;
  private parent: ArticleComment | null;
  private content: string;
  private createdAt: Date;
  private replies: ArticleComment[];

  getId(): number {
    return this.id;
  }

  getAuthor(): User {
    return this.author;
  }

  getArticleId(): string {
    return this.articleId;
  }

  getParent(): ArticleComment {
    return this.parent;
  }

  getContent(): string {
    return this.content;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getReplies(): ArticleComment[] {
    return this.replies;
  }

  setParent(parent: ArticleComment): void {
    this.parent = parent;
  }

  checkReplyAvailable() {
    if (this.parent) {
      throw new CannotReplyOnReplyCommentException(
        `답글에는 답글을 작성할 수 없습니다. parentId: ${this.parent.getId()}`,
      );
    }
  }

  static builder = class {
    id: number;
    author: User;
    articleId: string;
    parent: ArticleComment;
    content: string;
    createdAt: Date;
    replies: ArticleComment[];

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

    setParent(parent: ArticleComment): this {
      this.parent = parent;
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

    setReplies(replies: ArticleComment[]): this {
      this.replies = replies;
      return this;
    }

    build(): ArticleComment {
      return new ArticleComment(
        this.id,
        this.author,
        this.articleId,
        this.parent,
        this.content,
        this.createdAt,
        this.replies,
      );
    }
  };
}
