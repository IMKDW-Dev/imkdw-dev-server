import { InvalidNicknameException } from '../../../../../common/exceptions/400';
import Nickname from '../../../domain/vo/nickname.vo';

describe('Nickname', () => {
  describe('기본값', () => {
    it('닉네임이 없다면 기본값이 할당된다', () => {
      // Given
      const sut = new Nickname();

      // When, Then
      expect(sut.toString()).toHaveLength(8);
    });
  });

  describe('유효성 검사', () => {
    it('닉네임이 3자 미만인 경우 InvalidNicknameException 예외가 발생한다', () => {
      expect(() => new Nickname('a')).toThrow(InvalidNicknameException);
    });

    it('닉네임이 8자 초과인 경우 InvalidNicknameException 예외가 발생한다', () => {
      expect(() => new Nickname('a'.repeat(9))).toThrow(InvalidNicknameException);
    });

    it('닉네임에 특수문자가 포함된 경우 InvalidNicknameException 예외가 발생한다', () => {
      expect(() => new Nickname('a!@#')).toThrow(InvalidNicknameException);
    });
  });

  describe('toString', () => {
    it('toString 메서드를 통해 닉네임을 반환한다', () => {
      // Given
      const nickname = 'nickname';

      // When, Then
      expect(new Nickname(nickname).toString()).toBe(nickname);
    });
  });
});
