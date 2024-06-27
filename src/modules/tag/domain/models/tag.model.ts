import { InvalidTagNameException } from '../../../../common/exceptions/400';

export default class Tag {
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly MAX_NAME_LENGTH = 20;

  private id: number;
  private name: string;

  private constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.validate();
  }

  private validate() {
    if (!this.name) {
      throw new InvalidTagNameException(`태그 이름은 필수입니다.`);
    }

    if (this.name.length < Tag.MIN_NAME_LENGTH || this.name.length > Tag.MAX_NAME_LENGTH) {
      throw new InvalidTagNameException(
        `태그 이름은 ${Tag.MIN_NAME_LENGTH}자 이상 ${Tag.MAX_NAME_LENGTH}자 이하여야 합니다.`,
      );
    }
  }

  getId() {
    return this.id;
  }

  toString() {
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
