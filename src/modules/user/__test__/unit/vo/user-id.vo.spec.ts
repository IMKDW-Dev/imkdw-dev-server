import { InvalidUserIdException } from '../../../../../common/exceptions/400';
import UserId from '../../../domain/vo/user-id.vo';

describe('UserId', () => {
  let sut: UserId;

  beforeEach(() => {
    sut = new UserId();
  });

  describe('기본값', () => {
    it('아이디가 없다면 기본값이 할당된다', () => {
      expect(sut.toString()).toHaveLength(36);
    });
  });

  describe('유효성 검사', () => {
    it('아이디가 36자 미만인 경우 InvalidUserIdException 예외가 발생한다', () => {
      expect(() => new UserId('a')).toThrow(InvalidUserIdException);
    });

    it('아이디가 36자 초과인 경우 InvalidUserIdException 예외가 발생한다', () => {
      expect(() => new UserId('a'.repeat(37))).toThrow(InvalidUserIdException);
    });
  });

  describe('toString', () => {
    it('toString 메서드를 통해 아이디를 반환한다', () => {
      // Given
      const id = '123e4567-e89b-12d3-a456-426614174000';

      // When, Then
      expect(new UserId(id).toString()).toBe(id);
    });
  });
});
