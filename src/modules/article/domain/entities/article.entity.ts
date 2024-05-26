import { generateCUID } from '../../../../common/utils/cuid';
import Category from '../../../category/domain/entities/category.entity';
import Tag from '../../../tag/domain/entities/tag.entity';

export default class Article {
  constructor(builder: ArticleBuilder) {
    this.id = builder.id;
    this.title = builder.title;
    this.content = builder.content;
    this.category = builder.category;
    this.viewCount = builder.viewCount;
    this.commentCount = builder.commentCount;
    this.thumbnail = builder.thumbnail;
    this.tags = builder.tags;
    this.visible = builder.visible;
    this.createdAt = builder.createdAt;
  }

  private id: string;
  private title: string;
  private content: string;
  private category: Category;
  private viewCount: number;
  private commentCount: number;
  private thumbnail: string;
  private tags: Tag[];
  private visible: boolean;
  private createdAt: Date;

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getCategory(): Category {
    return this.category;
  }

  getViewCount(): number {
    return this.viewCount;
  }

  getCommentCount(): number {
    return this.commentCount;
  }

  getThumbnail(): string {
    return this.thumbnail;
  }

  getTags(): Tag[] {
    return this.tags;
  }

  getVisible(): boolean {
    return this.visible;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  addHashOnId(): void {
    this.id = `${this.id}-${generateCUID()}`;
  }

  addCommentCount(): void {
    this.viewCount += 1;
  }
}

export class ArticleBuilder {
  id: string;
  title: string;
  content: string;
  category: Category;
  viewCount: number;
  commentCount: number;
  thumbnail: string;
  tags: Tag[];
  visible: boolean;
  createdAt: Date;

  setId(id: string): ArticleBuilder {
    this.id = id;
    return this;
  }

  setTitle(title: string): ArticleBuilder {
    this.title = title;
    return this;
  }

  setContent(content: string): ArticleBuilder {
    this.content = content;
    return this;
  }

  setCategory(category: Category): ArticleBuilder {
    this.category = category;
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

  setThumbnail(thumbnail: string): ArticleBuilder {
    this.thumbnail = thumbnail;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleBuilder {
    this.createdAt = createdAt;
    return this;
  }

  setTags(tags: Tag[]): ArticleBuilder {
    this.tags = tags;
    return this;
  }

  setVisible(visible: boolean): ArticleBuilder {
    this.visible = visible;
    return this;
  }

  build(): Article {
    return new Article(this);
  }
}
