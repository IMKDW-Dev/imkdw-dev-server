import { InvalidArticleContentException } from '../../../../../../../common/exceptions/400';
import ArticleContent from '../../../../domain/vo/article-content.vo';

describe('ArticleContent', () => {
  describe('내용이 2글자 미만이라면', () => {
    it('예외가 발생한다', () => {
      expect(() => new ArticleContent('a')).toThrow(InvalidArticleContentException);
    });
  });

  describe('내용이 65000글자 초과인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new ArticleContent('a'.repeat(65001))).toThrow(InvalidArticleContentException);
    });
  });

  describe('기존 내용에 이미지 URL이 주어지고', () => {
    const sut = new ArticleContent('![image1](/javascript.png) ![image2](/java.png)');
    describe('이미지 URL들을 변경하면', () => {
      const updatedContent = sut.updateImageUrls([
        { fromPath: '/javascript.png', toPath: '/typescript.png' },
        { fromPath: '/java.png', toPath: '/kotlin.png' },
      ]);

      it('이미지 URL이 변경된다', () => {
        expect(updatedContent.toString()).toBe('![image1](/typescript.png) ![image2](/kotlin.png)');
      });
    });
  });
});
