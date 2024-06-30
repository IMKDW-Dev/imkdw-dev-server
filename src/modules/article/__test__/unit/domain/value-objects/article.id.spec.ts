import ArticleId from '../../../../domain/vo/article-id.vo';

describe('ArticleId', () => {
  describe('addHash', () => {
    it('-를 포함한 9자의 무작위 문자열이 해시로 추가된다', () => {
      // Given
      const articleId = new ArticleId('asap');

      // When
      articleId.addHash();

      // Then
      expect(articleId.id).toHaveLength(13);
    });
  });
});
