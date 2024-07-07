import { CategoryHaveArticlesException } from '../../../../../common/exceptions/403';
import Category from '../../../domain/models/category.model';

describe('Category', () => {
  const name = 'a'.repeat(5);
  const desc = 'a'.repeat(10);

  describe('게시글이 1개 작성된 카테고리가 주어지고', () => {
    const sut = new Category.builder().setName(name).setDesc(desc).setArticleCount(1).build();
    describe('삭제가 가능한지 확인하면', () => {
      it('예외가 발생한다', () => {
        expect(() => sut.checkAvailableDelete()).toThrow(CategoryHaveArticlesException);
      });
    });
  });

  describe('게시글이 0개 작성된 카테고리가 주어지고', () => {
    const sut = new Category.builder().setName(name).setDesc(desc).setArticleCount(0).build();
    describe('삭제가 가능한지 확인하면', () => {
      it('예외가 발생하지 않는다', () => {
        expect(() => sut.checkAvailableDelete()).not.toThrow();
      });
    });
  });
});
