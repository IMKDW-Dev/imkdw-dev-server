import { InvalidArticleCommentContentException } from '../../../../../common/exceptions/400';

export default class CommentContent {
  private static readonly MIN_CONTENT_LENGTH = 2;
  private static readonly MAX_CONTENT_LENGTH = 255;
  private value: string;

  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    if (
      this.value.length < CommentContent.MIN_CONTENT_LENGTH ||
      this.value.length > CommentContent.MAX_CONTENT_LENGTH
    ) {
      throw new InvalidArticleCommentContentException(
        `댓글 내용은 ${CommentContent.MIN_CONTENT_LENGTH}자 이상 ${CommentContent.MAX_CONTENT_LENGTH}자 이하여야 합니다.`,
      );
    }
  }

  toString() {
    return this.value;
  }
}
