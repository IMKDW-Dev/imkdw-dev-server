import { InvalidCategoryDescException } from '../../../../common/exceptions/400';

/**
 * 카테고리 설명 유효성 규칙
 * - 10자 이상 200자 이하여야 한다
 */
export default class CategoryDesc {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 200;

  private readonly value: string;

  constructor(name?: string) {
    this.value = name;
    this.validate();
  }

  private validate(): void {
    if (this.value.length < CategoryDesc.MIN_LENGTH || this.value.length > CategoryDesc.MAX_LENGTH) {
      throw new InvalidCategoryDescException(
        `카테고리 내용은 ${CategoryDesc.MIN_LENGTH}자 이상 ${CategoryDesc.MAX_LENGTH}자 이하여야 합니다.`,
      );
    }
  }

  toString(): string {
    return this.value;
  }
}
