import { InvalidTagNameException } from '../../../../../../../common/exceptions/400';
import Tag from '../../../../domain/models/tag.model';

describe('Tag', () => {
  describe('공백으로', () => {
    describe('태그를 생성하면', () => {
      it('예외가 발생한다', () => {
        expect(() => new Tag.builder().setName(' ').build()).toThrow(InvalidTagNameException);
      });
    });
  });

  describe('2글자 미만인 이름으로', () => {
    describe('태그를 생성하면', () => {
      it('예외가 발생한다', () => {
        expect(() => new Tag.builder().setName('a').build()).toThrow(InvalidTagNameException);
      });
    });
  });

  describe('20자 초과인 이름으로', () => {
    describe('태그를 생성하면', () => {
      it('예외가 발생한다', () => {
        expect(() => new Tag.builder().setName('a'.repeat(21)).build()).toThrow(InvalidTagNameException);
      });
    });
  });

  describe('10자의 이름으로', () => {
    describe('태그를 생성하면', () => {
      it('예외가 발생하지 않는다', () => {
        expect(() => new Tag.builder().setName('a'.repeat(10)).build()).not.toThrow();
      });
    });
  });
});
