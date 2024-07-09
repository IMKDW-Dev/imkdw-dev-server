import { InvalidTagNameException } from '../../../../../../../common/exceptions/400';
import Tag from '../../../../domain/models/tag.model';

describe('Tag', () => {
  describe('유효성검사', () => {
    it('태그 이름이 없는 경우 InvalidTagNameException 에러가 발생한다', () => {
      // Given
      const tagName = '';

      // When, Then
      expect(() => new Tag.builder().setName(tagName).build()).toThrow(InvalidTagNameException);
    });

    it('태그 이름이 2자 미만인 경우 InvalidTagNameException 에러가 발생한다', () => {
      // Given
      const tagName = 'a';

      // When, Then
      expect(() => new Tag.builder().setName(tagName).build()).toThrow(InvalidTagNameException);
    });

    it('태그 이름이 20자 초과인 경우 InvalidTagNameException 에러가 발생한다', () => {
      // Given
      const tagName = 'a'.repeat(21);

      // When, Then
      expect(() => new Tag.builder().setName(tagName).build()).toThrow(InvalidTagNameException);
    });
  });
});
