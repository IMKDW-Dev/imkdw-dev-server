import { InvalidArticleContentException } from '../../../../../common/exceptions/400';

export default class ArticleContent {
  private static readonly MIN_CONTENT_LENGTH = 2;
  private static readonly MAX_CONTENT_LENGTH = 65_000;
  private value: string;

  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    if (
      this.value.length < ArticleContent.MIN_CONTENT_LENGTH ||
      this.value.length > ArticleContent.MAX_CONTENT_LENGTH
    ) {
      throw new InvalidArticleContentException(
        `내용은 ${ArticleContent.MIN_CONTENT_LENGTH}자 이상 ${ArticleContent.MAX_CONTENT_LENGTH}자 이하여야 합니다.`,
      );
    }
  }

  updateImageUrls(paths: { fromPath: string; toPath: string }[]) {
    let content = this.value;
    paths.forEach(({ fromPath, toPath }) => {
      content = content.replace(fromPath, toPath);
    });
    return new ArticleContent(content);
  }

  toString() {
    return this.value;
  }
}
