import { generateCUID } from '../../../../common/utils/cuid';

export default class Article {
  constructor(builder: ArticleBuilder) {
    this.id = builder.id;
    this.title = builder.title;
    this.categoryId = builder.categoryId;
    this.content = builder.content;
    this.visible = builder.visible;
    this.thumbnail = builder.thumbnail;
    this.viewCount = builder.viewCount;
    this.commentCount = builder.commentCount;
    this.createdAt = builder.createdAt;
  }

  private id: string;
  private title: string;
  private categoryId: number;
  private content: string;
  private visible: boolean;
  private thumbnail: string;
  private viewCount: number;
  private commentCount: number;
  private createdAt: Date;

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getCategoryId(): number {
    return this.categoryId;
  }

  getContent(): string {
    return this.content;
  }

  getVisible(): boolean {
    return this.visible;
  }

  getThumbnail(): string {
    return this.thumbnail;
  }

  getViewCount(): number {
    return this.viewCount;
  }

  getCommentCount(): number {
    return this.commentCount;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  addHashOnId(): void {
    this.id = `${this.id}-${generateCUID()}`;
  }
}

export class ArticleBuilder {
  id: string;
  title: string;
  categoryId: number;
  content: string;
  visible: boolean;
  thumbnail: string;
  viewCount: number;
  commentCount: number;
  createdAt: Date;

  setId(id: string): ArticleBuilder {
    this.id = id;
    return this;
  }

  setTitle(title: string): ArticleBuilder {
    this.title = title;
    return this;
  }

  setCategoryId(categoryId: number): ArticleBuilder {
    this.categoryId = categoryId;
    return this;
  }

  setContent(content: string): ArticleBuilder {
    this.content = content;
    return this;
  }

  setVisible(visible: boolean): ArticleBuilder {
    this.visible = visible;
    return this;
  }

  setThumbnail(thumbnail: string): ArticleBuilder {
    this.thumbnail = thumbnail;
    return this;
  }

  setViewCount(viewCount: number): ArticleBuilder {
    this.viewCount = viewCount;
    return this;
  }

  setCommentCount(commentCount: number): ArticleBuilder {
    this.commentCount = commentCount;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleBuilder {
    this.createdAt = createdAt;
    return this;
  }

  build(): Article {
    return new Article(this);
  }
}
