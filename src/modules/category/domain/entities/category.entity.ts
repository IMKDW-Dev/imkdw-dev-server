import CategoryDto from '../../dto/category.dto';

export default class Category {
  constructor(builder: CategoryBuilder) {
    this.id = builder.id;
    this.name = builder.name;
    this.sort = builder.sort;
    this.image = builder.image;
    this.desc = builder.desc;
  }

  private id: number;
  private name: string;
  private sort: number;
  private image: string;
  private desc: string;

  // TODO: 게시글 개수 하드코딩 제거
  private articleCount: number = 0;

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getSort(): number {
    return this.sort;
  }

  getImage(): string {
    return this.image;
  }

  getDesc(): string {
    return this.desc;
  }

  getArticleCount(): number {
    return this.articleCount;
  }

  toDto(): CategoryDto {
    return new CategoryDto(this.id, this.name, this.sort, this.desc, this.image, this.articleCount);
  }
}

export class CategoryBuilder {
  id: number;
  name: string;
  sort: number;
  image: string;
  desc: string;
  articleCount: number;

  public setId(id: number): CategoryBuilder {
    this.id = id;
    return this;
  }

  public setName(name: string): CategoryBuilder {
    this.name = name;
    return this;
  }

  public setSort(sort: number): CategoryBuilder {
    this.sort = sort;
    return this;
  }

  public setImage(image: string): CategoryBuilder {
    this.image = image;
    return this;
  }

  public setDesc(desc: string): CategoryBuilder {
    this.desc = desc;
    return this;
  }

  public build(): Category {
    return new Category(this);
  }
}
