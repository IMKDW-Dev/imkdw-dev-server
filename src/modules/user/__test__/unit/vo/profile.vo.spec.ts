import { DEFAULT_PROFILE } from '../../../constants/user.constant';
import Profile from '../../../domain/vo/profile.vo';

describe('Profile', () => {
  let sut: Profile;

  beforeEach(() => {
    sut = new Profile();
  });

  describe('기본값', () => {
    it('닉네임이 없다면 기본값이 할당된다', () => {
      expect(sut.toString()).toBe(DEFAULT_PROFILE);
    });
  });

  describe('toString', () => {
    it('프로필을 문자열로 반환한다', () => {
      // Given
      const profile = 'https://image.com';

      // When, Then
      expect(new Profile(profile).toString()).toBe(profile);
    });
  });
});
