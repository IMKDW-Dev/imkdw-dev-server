import ArticleContent from '../../domain/value-objects/article-content.vo';

describe('ArticleContent', () => {
  describe('replaceImageUrls', () => {
    it('이미지 URL이 모두 변경된다', () => {
      // Arrange
      const articleContent = new ArticleContent('Hello, ![image1](/image1.png)!');
      const paths = [{ fromPath: '/image1.png', toPath: '/image2.png' }];

      // Act
      articleContent.replaceImageUrls(paths);

      // Assert
      expect(articleContent.getContent()).toBe('Hello, ![image1](/image2.png)!');
    });
  });
});
