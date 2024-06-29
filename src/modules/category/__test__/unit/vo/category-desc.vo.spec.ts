import { InvalidCategoryDescException } from '../../../../../common/exceptions/400';
import CategoryDesc from '../../../domain/vo/category-desc.vo';

describe('CategoryDesc', () => {
  describe('유효성 검사', () => {
    it('카테고리 설명이 10자 미만인 경우 InvalidCategoryDescException 예외가 발생한다', () => {
      // Given
      const categoryDesc = 'a'.repeat(9);

      // When, Then
      expect(() => new CategoryDesc(categoryDesc)).toThrow(InvalidCategoryDescException);
    });

    it('카테고리 설명이 200자 초과인 경우 InvalidCategoryDescException 예외가 발생한다', () => {
      // Given
      const categoryDesc = 'a'.repeat(201);

      // When, Then
      expect(() => new CategoryDesc(categoryDesc)).toThrow(InvalidCategoryDescException);
    });
  });

  describe('toString', () => {
    it('toString 메서드를 통해 카테고리 설명을 반환한다', () => {
      // Given
      const categoryDesc = 'categoryDesc';

      // When, Then
      expect(new CategoryDesc(categoryDesc).toString()).toBe(categoryDesc);
    });
  });
});
