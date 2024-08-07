import { validate } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../../common/exceptions/400';
import IsArticleTitle from '../../../decorators/validation/is-article-title.decorator';

describe('@IsArticleTitle', () => {
  class TestClass {
    constructor(title: string) {
      this.title = title;
    }
    @IsArticleTitle()
    title: string;
  }

  describe('게시글 제목이 9글자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(9));
      const errors = await validate(test);
      expect(errors[0].constraints.IsArticleTitle).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_TITLE);
    });
  });

  describe('게시글 제목이 10글자인 경우', () => {
    it('유효성 검사를 통과한다', async () => {
      const test = new TestClass('v'.repeat(10));
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    });
  });

  describe('게시글 제목이 256글자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(256));
      const errors = await validate(test);
      expect(errors[0].constraints.IsArticleTitle).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_TITLE);
    });
  });
});
