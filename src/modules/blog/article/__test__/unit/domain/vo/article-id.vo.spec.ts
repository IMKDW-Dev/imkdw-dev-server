import { InvalidArticleIdException } from '../../../../../../../common/exceptions/400';
import ArticleId from '../../../../domain/vo/article-id.vo';

describe('ArticleId', () => {
  describe('아이디가 10자 미만인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new ArticleId('a')).toThrow(InvalidArticleIdException);
    });
  });

  describe('아이디가 255자 초과인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new ArticleId('a'.repeat(256))).toThrow(InvalidArticleIdException);
    });
  });

  describe('아이디가 10~255자 사이인 경우', () => {
    it('예외가 발생하지 않는다', () => {
      expect(() => new ArticleId('a'.repeat(10))).not.toThrow();
    });
  });

  describe('해시값이 추가되지 않은 아이디가 주어지고', () => {
    const sut = new ArticleId('a'.repeat(100));
    describe('해시값을 추가하면', () => {
      const updatedId = sut.addHash();
      it('값이 추가된 아이디를 반환한다', () => {
        /**
         * 해시(8자리) + 대시(1자리)를 포함한 아이디가 된다.
         */
        expect(updatedId.toString()).toHaveLength(sut.toString().length + 9);
      });
    });
  });
});
