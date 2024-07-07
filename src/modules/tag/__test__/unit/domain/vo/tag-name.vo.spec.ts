import { InvalidTagNameException } from '../../../../../../common/exceptions/400';
import TagName from '../../../../domain/vo/tag-name.vo';

describe('TagName', () => {
  describe('태그 이름이 2자 미만인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new TagName('a')).toThrow(InvalidTagNameException);
    });
  });

  describe('태그 이름이 20자 초과인 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new TagName('a'.repeat(21))).toThrow(InvalidTagNameException);
    });
  });

  describe('태그 이름에 공백이 포함된 경우', () => {
    it('예외가 발생한다', () => {
      expect(() => new TagName('a b')).toThrow(InvalidTagNameException);
    });
  });

  describe('태그 이름이 2~20자 사이인 경우', () => {
    it('예외가 발생하지 않는다', () => {
      expect(() => new TagName('a'.repeat(2))).not.toThrow();
    });
  });
});
