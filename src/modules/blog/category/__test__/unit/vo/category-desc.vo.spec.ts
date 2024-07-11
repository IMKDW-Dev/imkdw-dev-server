import { InvalidCategoryDescException } from '../../../../../../common/exceptions/400';
import CategoryDesc from '../../../domain/vo/category-desc.vo';

describe('CategoryDesc', () => {
  describe('카테고리 설명이 10자 미만인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new CategoryDesc('a'.repeat(9))).toThrow(InvalidCategoryDescException);
    });
  });

  describe('카테고리 설명이 200자 초과인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new CategoryDesc('a'.repeat(201))).toThrow(InvalidCategoryDescException);
    });
  });
});
