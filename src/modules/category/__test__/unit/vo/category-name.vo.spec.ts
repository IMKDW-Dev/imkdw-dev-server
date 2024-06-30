import { InvalidCategoryNameException } from '../../../../../common/exceptions/400';
import CategoryName from '../../../domain/vo/category-name.vo';

describe('CategoryName', () => {
  describe('유효성 검사', () => {
    it('카테고리 이름이 2자 미만인 경우 InvalidCategoryNameException 예외가 발생한다', () => {
      expect(() => new CategoryName('a')).toThrow();
    });

    it('카테고리 이름이 20자 초과인 경우 InvalidCategoryNameException 예외가 발생한다', () => {
      expect(() => new CategoryName('a'.repeat(21))).toThrow(InvalidCategoryNameException);
    });

    it('카테고리 이름에 공백이 포함된 경우 InvalidCategoryNameException 예외가 발생한다', () => {
      expect(() => new CategoryName('a b')).toThrow(InvalidCategoryNameException);
    });
  });

  describe('toString', () => {
    it('toString 메서드를 통해 카테고리 이름을 반환한다', () => {
      // Given
      const categoryName = 'categoryName';

      // When, Then
      expect(new CategoryName(categoryName).toString()).toBe(categoryName);
    });
  });
});
