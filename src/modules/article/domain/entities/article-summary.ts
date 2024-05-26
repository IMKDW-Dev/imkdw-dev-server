import Category from '../../../category/domain/entities/category.entity';

export default class ArticleSummary {
  constructor(builder: ArticleSummaryBuilder) {
    this.id = builder.id;
    this.thumbnail = builder.thumbnail;
    this.title = builder.title;
    this.content = builder.content;
    this.viewCount = builder.viewCount;
    this.createdAt = builder.createdAt;
    this.category = builder.category;
  }

  private id: number;
  private thumbnail: string;
  private title: string;
  private content: string;
  private viewCount: number;
  private createdAt: Date;
  private category: Category;
}

export class ArticleSummaryBuilder {
  id: number;
  thumbnail: string;
  title: string;
  content: string;
  viewCount: number;
  createdAt: Date;
  category: Category;

  setId(id: number): ArticleSummaryBuilder {
    this.id = id;
    return this;
  }

  setThumbnail(thumbnail: string): ArticleSummaryBuilder {
    this.thumbnail = thumbnail;
    return this;
  }

  setTitle(title: string): ArticleSummaryBuilder {
    this.title = title;
    return this;
  }

  setContent(content: string): ArticleSummaryBuilder {
    this.content = content;
    return this;
  }

  setViewCount(viewCount: number): ArticleSummaryBuilder {
    this.viewCount = viewCount;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleSummaryBuilder {
    this.createdAt = createdAt;
    return this;
  }

  setCategory(category: Category): ArticleSummaryBuilder {
    this.category = category;
    return this;
  }

  build(): ArticleSummary {
    return new ArticleSummary(this);
  }
}
