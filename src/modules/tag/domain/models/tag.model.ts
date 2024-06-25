export default class Tag {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  private id: number;
  private name: string;

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  static builder = class {
    id: number;
    name: string;

    setId(id: number) {
      this.id = id;
      return this;
    }

    setName(name: string) {
      this.name = name;
      return this;
    }

    build() {
      return new Tag(this.id, this.name);
    }
  };
}
