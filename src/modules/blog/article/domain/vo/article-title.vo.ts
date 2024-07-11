import { InvalidArticleTitleException } from '../../../../../common/exceptions/400';

export default class ArticleTitle {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 255;

  private value: string;

  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    if (this.value.length < ArticleTitle.MIN_LENGTH || this.value.length > ArticleTitle.MAX_LENGTH) {
      throw new InvalidArticleTitleException(
        `제목은 ${ArticleTitle.MIN_LENGTH}자 이상 ${ArticleTitle.MAX_LENGTH}자 이하여야 합니다.`,
      );
    }
  }

  toString() {
    return this.value;
  }
}
