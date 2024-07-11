import { InvalidCategoryNameException } from '../../../../../../common/exceptions/400';
import CategoryName from '../../../domain/vo/category-name.vo';

describe('CategoryName', () => {
  describe('카테고리 이름이 2자 미만인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new CategoryName('a')).toThrow(InvalidCategoryNameException);
    });
  });

  describe('카테고리 이름이 20자 초과인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new CategoryName('a'.repeat(21))).toThrow(InvalidCategoryNameException);
    });
  });

  describe('카테고리 이름에 공백이 포함된 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new CategoryName('a b')).toThrow(InvalidCategoryNameException);
    });
  });

  describe('카테고리 이름이 2~20자 사이인 경우', () => {
    it('예외가 발생하지 않는다', () => {
      expect(() => new CategoryName('a'.repeat(2))).not.toThrow();
    });
  });
});
