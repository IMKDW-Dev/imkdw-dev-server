import { validate } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../common/exceptions/400';
import IsCategoryDesc from '../../../decorators/validation/is-category-desc.decorator';

describe('@IsCategoryDesc', () => {
  class TestClass {
    constructor(desc: string) {
      this.desc = desc;
    }
    @IsCategoryDesc()
    desc: string;
  }

  describe('카테고리 내용이 9자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(9));
      const errors = await validate(test);
      expect(errors[0].constraints.IsCategoryDesc).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_CATEGORY_DESC);
    });
  });

  describe('카테고리 내용이 10자인 경우', () => {
    it('유효성 검사를 통과한다', async () => {
      const test = new TestClass('v'.repeat(10));
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    });
  });

  describe('카테고리 내용이 201자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(201));
      const errors = await validate(test);
      expect(errors[0].constraints.IsCategoryDesc).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_CATEGORY_DESC);
    });
  });
});
