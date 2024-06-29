import TagName from '../vo/tag-name.vo';

export default class Tag {
  private id: number;
  private name: TagName;

  private constructor(id: number, name: string) {
    this.id = id;
    this.name = new TagName(name);
  }

  getId() {
    return this.id;
  }

  toString() {
    return this.name.toString();
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
