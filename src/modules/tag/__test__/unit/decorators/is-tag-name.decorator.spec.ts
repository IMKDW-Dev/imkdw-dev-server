import { validate } from 'class-validator';
import IsTagName from '../../../decorators/validation/is-tag-name.decorator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../common/exceptions/400';

describe('@IsTagName', () => {
  class TestClass {
    constructor(tagName: string) {
      this.tagName = tagName;
    }
    @IsTagName()
    tagName: string;
  }

  it('태그 이름이 1글자인 경우 INVALID_TAG_NAME 에러가 발생한다', async () => {
    const test = new TestClass('v');
    const errors = await validate(test);
    expect(errors[0].constraints.IsTagName).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_TAG_NAME);
  });

  it('태그 이름이 2글자인 경우 유효성 검사를 통과한다', async () => {
    const test = new TestClass('va');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('태그 이름이 21글자인 경우 INVALID_TAG_NAME 에러가 발생한다', async () => {
    const test = new TestClass('v'.repeat(21));
    const errors = await validate(test);
    expect(errors[0].constraints.IsTagName).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_TAG_NAME);
  });

  it('태그 이름에 공백이 포함된 경우 INVALID_TAG_NAME 에러가 발생한다', async () => {
    const test = new TestClass('v a');
    const errors = await validate(test);
    expect(errors[0].constraints.IsTagName).toBe(BAD_REQUEST_EXCEPTIONS.INVALID_TAG_NAME);
  });
});
