import Category from '../../../category/domain/entities/category.entity';

export default class Article {
  constructor(builder: ArticleBuilder) {
    this.id = builder.id;
    this.title = builder.title;
    this.content = builder.content;
    this.categories = builder.categories;
    this.createdAt = builder.createdAt;
  }

  private id: string;
  private title: string;
  private content: string;
  private categories: Category[];
  private createdAt: Date;
}

export class ArticleBuilder {
  id: string;
  title: string;
  content: string;
  categories: Category[];
  createdAt: Date;

  public withId(id: string): ArticleBuilder {
    this.id = id;
    return this;
  }

  public withTitle(title: string): ArticleBuilder {
    this.title = title;
    return this;
  }

  public withContent(content: string): ArticleBuilder {
    this.content = content;
    return this;
  }

  public withCategories(categories: Category[]): ArticleBuilder {
    this.categories = categories;
    return this;
  }

  public withCreatedAt(createdAt: Date): ArticleBuilder {
    this.createdAt = createdAt;
    return this;
  }

  public build(): Article {
    return new Article(this);
  }
}
