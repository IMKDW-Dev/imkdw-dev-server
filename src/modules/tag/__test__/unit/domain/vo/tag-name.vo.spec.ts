import { InvalidTagNameException } from '../../../../../../common/exceptions/400';
import TagName from '../../../../domain/vo/tag-name.vo';

describe('TagName', () => {
  describe('유효성 검사', () => {
    it('태그 이름이 2자 미만인 경우 InvalidTagNameException 예외가 발생한다', () => {
      expect(() => new TagName('a')).toThrow(InvalidTagNameException);
    });

    it('태그 이름이 20자 초과인 경우 InvalidTagNameException 예외가 발생한다', () => {
      expect(() => new TagName('a'.repeat(21))).toThrow(InvalidTagNameException);
    });
  });

  describe('toString', () => {
    it('태그 이름을 반환한다', () => {
      const tagName = new TagName('tag');
      expect(tagName.toString()).toBe('tag');
    });
  });
});
