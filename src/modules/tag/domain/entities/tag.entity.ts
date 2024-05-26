export default class Tag {
  constructor(builder: TagBuilder) {
    this.id = builder.id;
    this.name = builder.name;
  }

  private id: number;
  private name: string;

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}

export class TagBuilder {
  id: number;
  name: string;

  setId(id: number): TagBuilder {
    this.id = id;
    return this;
  }

  setName(name: string): TagBuilder {
    this.name = name;
    return this;
  }

  build(): Tag {
    return new Tag(this);
  }
}
