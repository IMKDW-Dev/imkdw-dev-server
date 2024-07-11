import { InvalidCategoryNameException } from '../../../../../common/exceptions/400';

export default class CategoryName {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 20;
  private readonly value: string;

  constructor(name?: string) {
    this.value = name;
    this.validate();
  }

  private validate(): void {
    if (this.value.length < CategoryName.MIN_LENGTH || this.value.length > CategoryName.MAX_LENGTH) {
      throw new InvalidCategoryNameException(
        `카테고리 이름은 ${CategoryName.MIN_LENGTH}자 이상 ${CategoryName.MAX_LENGTH}자 이하여야 합니다.`,
      );
    }

    if (/\s/.test(this.value)) {
      throw new InvalidCategoryNameException('카테고리 이름에 공백을 포함할 수 없습니다.');
    }
  }

  toString(): string {
    return this.value;
  }
}
