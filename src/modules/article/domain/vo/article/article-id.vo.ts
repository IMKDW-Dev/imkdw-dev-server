import { InvalidArticleIdException } from '../../../../../common/exceptions/400';
import { generateCUID } from '../../../../../common/utils/cuid';

export default class ArticleId {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 255;
  private value: string;

  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    if (this.value.length < ArticleId.MIN_LENGTH || this.value.length > ArticleId.MAX_LENGTH) {
      throw new InvalidArticleIdException(
        `게시글 아이디는 ${ArticleId.MIN_LENGTH}자 이상 ${ArticleId.MAX_LENGTH}자 이하여야 합니다.`,
      );
    }
  }

  addHash() {
    const hashedId = `${this.value}-${this.generateIdHash()}`;
    return new ArticleId(hashedId);
  }

  toString() {
    return this.value;
  }

  private generateIdHash() {
    return generateCUID().slice(0, 8);
  }
}
