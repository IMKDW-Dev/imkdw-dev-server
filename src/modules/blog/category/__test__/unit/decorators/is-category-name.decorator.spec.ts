import { validate } from 'class-validator';
import IsCategoryName from '../../../decorators/validation/is-category-name.decorator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../../common/exceptions/400';

describe('@IsCategoryDesc', () => {
  class TestClass {
    constructor(name: string) {
      this.name = name;
    }
    @IsCategoryName()
    name: string;
  }

  describe('카테고리 이름이 1자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v');
      const errors = await validate(test);
      expect(errors[0].constraints.IsCategoryName).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_CATEGORY_NAME);
    });
  });

  describe('카테고리 이름이 2자인 경우', () => {
    it('유효성 검사를 통과한다', async () => {
      const test = new TestClass('vv');
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    });
  });

  describe('카테고리 이름이 21자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(21));
      const errors = await validate(test);
      expect(errors[0].constraints.IsCategoryName).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_CATEGORY_NAME);
    });
  });

  describe('카테고리 이름이 20자인 경우', () => {
    it('유효성 검사를 통과한다', async () => {
      const test = new TestClass('v'.repeat(20));
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    });
  });
});
