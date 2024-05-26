import CategoryDto from '../../dto/category.dto';
import { CategoryDtoBuilder } from '../../dto/category.dto';

export default class Category {
  constructor(builder: CategoryBuilder) {
    this.id = builder.id;
    this.name = builder.name;
    this.image = builder.image;
    this.desc = builder.desc;
    this.sort = builder.sort;
  }

  private id: number;
  private name: string;
  private image: string | null;
  private desc: string;
  private sort: number;

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getImage(): string | null {
    return this.image;
  }

  getDesc(): string {
    return this.desc;
  }

  getSort(): number {
    return this.sort;
  }

  toDto(): CategoryDto {
    return new CategoryDtoBuilder()
      .setId(this.id)
      .setName(this.name)
      .setImage(this.image)
      .setDesc(this.desc)
      .setSort(this.sort)
      .build();
  }
}

export class CategoryBuilder {
  id: number;
  name: string;
  image: string | null;
  desc: string;
  sort: number;

  setId(id: number): CategoryBuilder {
    this.id = id;
    return this;
  }

  setName(name: string): CategoryBuilder {
    this.name = name;
    return this;
  }

  setImage(image: string | null): CategoryBuilder {
    this.image = image;
    return this;
  }

  setDesc(desc: string): CategoryBuilder {
    this.desc = desc;
    return this;
  }

  setSort(sort: number): CategoryBuilder {
    this.sort = sort;
    return this;
  }

  build(): Category {
    return new Category(this);
  }
}
