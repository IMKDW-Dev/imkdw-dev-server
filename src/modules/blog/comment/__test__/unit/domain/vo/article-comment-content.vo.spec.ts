import { InvalidArticleCommentContentException } from '../../../../../../../common/exceptions/400';
import CommentContent from '../../../../domain/vo/article-comment-content.vo';

describe('CommentContent', () => {
  describe('내용이 2글자 미만이라면', () => {
    it('예외가 발생한다', () => {
      expect(() => new CommentContent('a')).toThrow(InvalidArticleCommentContentException);
    });
  });

  describe('내용이 255자 초과인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new CommentContent('a'.repeat(256))).toThrow(InvalidArticleCommentContentException);
    });
  });

  describe('내용이 2~255자 사이인 경우', () => {
    it('예외가 발생하지 않는다', () => {
      expect(() => new CommentContent('a'.repeat(2))).not.toThrow();
    });
  });
});
