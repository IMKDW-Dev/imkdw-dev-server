import { validate } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../common/exceptions/400';
import IsCommentContent from '../../../decorators/validation/is-comment-content.decorator';

describe('@IsCommentContent', () => {
  class TestClass {
    constructor(content: string) {
      this.content = content;
    }
    @IsCommentContent()
    content: string;
  }

  describe('댓글 내용이 1글자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v');
      const errors = await validate(test);
      expect(errors[0].constraints.IsCommentContent).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_COMMENT_CONTENT);
    });
  });

  describe('댓글 내용이 2글자인 경우', () => {
    it('유효성 검사를 통과한다', async () => {
      const test = new TestClass('va');
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    });
  });

  describe('댓글 내용이 256글자인 경우', () => {
    it('예외가 발생한다', async () => {
      const test = new TestClass('v'.repeat(256));
      const errors = await validate(test);
      expect(errors[0].constraints.IsCommentContent).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_COMMENT_CONTENT);
    });
  });
});
