export default class Category {
  constructor(builder: CategoryBuilder) {
    this.id = builder.id;
    this.name = builder.name;
    this.sort = builder.sort;
  }

  private id: number;
  private name: string;
  private sort: number;

  getName(): string {
    return this.name;
  }

  getSort(): number {
    return this.sort;
  }
}

export class CategoryBuilder {
  id: number;
  name: string;
  sort: number;

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

  public build(): Category {
    return new Category(this);
  }
}
