export default class ArticleComment {
  constructor(builder: ArticleCommentBuilder) {
    this.id = builder.id;
    this.articleId = builder.articleId;
    this.parentId = builder.parentId;
    this.content = builder.content;
    this.userId = builder.userId;
  }

  private id: number;
  private userId: string;
  private articleId: string;
  private parentId: number | null;
  private content: string;

  getId(): number {
    return this.id;
  }

  getArticleId(): string {
    return this.articleId;
  }

  getParentId(): number | null {
    return this.parentId;
  }

  getContent(): string {
    return this.content;
  }

  getUserId(): string {
    return this.userId;
  }

  isParentComment(): boolean {
    return this.parentId !== null;
  }
}

export class ArticleCommentBuilder {
  id: number;
  userId: string;
  articleId: string;
  parentId: number | null;
  content: string;

  setId(id: number): ArticleCommentBuilder {
    this.id = id;
    return this;
  }

  setArticleId(articleId: string): ArticleCommentBuilder {
    this.articleId = articleId;
    return this;
  }

  setParentId(parentId: number | null): ArticleCommentBuilder {
    this.parentId = parentId;
    return this;
  }

  setContent(content: string): ArticleCommentBuilder {
    this.content = content;
    return this;
  }

  setUserId(userId: string): ArticleCommentBuilder {
    this.userId = userId;
    return this;
  }

  build(): ArticleComment {
    return new ArticleComment(this);
  }
}
