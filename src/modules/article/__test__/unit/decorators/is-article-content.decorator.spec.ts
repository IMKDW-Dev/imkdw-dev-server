import { validate } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../common/exceptions/400';
import IsArticleContent from '../../../decorators/validation/is-article-content.decorator';

describe('@IsArticleContent', () => {
  class TestClass {
    constructor(content: string) {
      this.content = content;
    }
    @IsArticleContent()
    content: string;
  }

  it('게시글 내용이 1글자인 경우 INVALID_TAG_NAME 에러가 발생한다', async () => {
    const test = new TestClass('v');
    const errors = await validate(test);
    expect(errors[0].constraints.IsArticleContent).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_CONTENT);
  });

  it('게시글 내용이 2글자인 경우 유효성 검사를 통과한다', async () => {
    const test = new TestClass('va');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('게시글 내용이 65001글자인 경우 INVALID_TAG_NAME 에러가 발생한다', async () => {
    const test = new TestClass('v'.repeat(65001));
    const errors = await validate(test);
    expect(errors[0].constraints.IsArticleContent).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_CONTENT);
  });
});
