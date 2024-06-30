import { InvalidTagNameException } from '../../../../common/exceptions/400';

export default class TagName {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 20;

  private value: string;

  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    if (this.value.length < TagName.MIN_LENGTH || this.value.length > TagName.MAX_LENGTH) {
      throw new InvalidTagNameException(
        `태그 이름은 ${TagName.MIN_LENGTH}자 이상 ${TagName.MAX_LENGTH}자 이하여야 합니다.`,
      );
    }
  }

  toString() {
    return this.value;
  }
}
