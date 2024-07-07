import { InvalidArticleTitleException } from '../../../../../../../common/exceptions/400';
import ArticleTitle from '../../../../../domain/vo/article/article-title.vo';

describe('ArticleTitle', () => {
  describe('제목이 10자 미만인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new ArticleTitle('a'.repeat(9))).toThrow(InvalidArticleTitleException);
    });
  });

  describe('제목이 255자 초과인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new ArticleTitle('a'.repeat(256))).toThrow(InvalidArticleTitleException);
    });
  });

  describe('제목이 10~255자 사이인 경우', () => {
    it('예외가 발생하지 않는다', () => {
      expect(() => new ArticleTitle('a'.repeat(10))).not.toThrow();
    });
  });

  it('제목을 반환한다', () => {
    const title = 'a'.repeat(10);
    const articleTitle = new ArticleTitle(title);
    expect(articleTitle.toString()).toBe(title);
  });
});
