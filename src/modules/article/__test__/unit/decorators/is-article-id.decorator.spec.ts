import { validate } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../common/exceptions/400';
import IsArticleId from '../../../decorators/validation/is-article-id.decorator';

describe('@IsArticleId', () => {
  class TestClass {
    constructor(id: string) {
      this.id = id;
    }
    @IsArticleId()
    id: string;
  }

  describe('게시글 아이디가 9글자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(9));
      const errors = await validate(test);
      expect(errors[0].constraints.IsArticleId).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_ID);
    });
  });

  describe('게시글 아이디가 10글자인 경우', () => {
    it('유효성 검사를 통과한다', async () => {
      const test = new TestClass('v'.repeat(10));
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    });
  });

  describe('게시글 아이디가 246글자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(246));
      const errors = await validate(test);
      expect(errors[0].constraints.IsArticleId).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_ID);
    });
  });

  describe('게시글 아이디가 245글자인 경우', () => {
    it('유효성 검사를 통과한다', async () => {
      const test = new TestClass('v'.repeat(245));
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    });
  });

  describe('게시글 아이디에 영문, 특수문자, 숫자 외 다른 문자가 포함되면', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass(`${'v'.repeat(245)}한글`);
      const errors = await validate(test);
      expect(errors[0].constraints.IsArticleId).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_ID);
    });
  });
});
