import { CannotReplyOnReplyCommentException } from '../../../../../common/exceptions/403';
import User from '../../../../user/domain/models/user.model';
import CommentContent from '../vo/article-comment-content.vo';

export default class Comment {
  private constructor(
    id: number,
    author: User,
    articleId: string,
    parent: Comment,
    content: string,
    createdAt: Date,
    replies: Comment[],
  ) {
    this.id = id;
    this.author = author;
    this.articleId = articleId;
    this.parent = parent;
    this.content = new CommentContent(content);
    this.createdAt = createdAt;
    this.replies = replies;
  }

  private id: number;
  private author: User;
  private articleId: string;
  private parent: Comment | null;
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

  getParent(): Comment {
    return this.parent;
  }

  getContent(): string {
    return this.content.toString();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getReplies(): Comment[] {
    return this.replies;
  }

  setParent(parent: Comment): void {
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
    parent: Comment;
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

    setParent(parent: Comment): this {
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

    setReplies(replies: Comment[]): this {
      this.replies = replies;
      return this;
    }

    build(): Comment {
      return new Comment(this.id, this.author, this.articleId, this.parent, this.content, this.createdAt, this.replies);
    }
  };
}
