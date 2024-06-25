import { faker } from '@faker-js/faker';
import { DEFAULT_PROFILE } from '../../../constants/user.constant';
import User from '../../../domain/models/user.model';

describe('User', () => {
  let sut: User;

  beforeEach(() => {
    sut = new User.builder().build();
  });

  describe('아이디', () => {
    it('아이디가 없을경우 아이디가 자동 생성된다', () => {
      /**
       * 유저의 아이디는 UUID 형식으로 36자의 문자열을 가진다.
       */
      expect(sut.getId()).toHaveLength(36);
    });
  });

  describe('닉네임', () => {
    it('닉네임이 없을경우 닉네임이 자동 생성된다', () => {
      /**
       * 유저의 닉네임은 8자의 문자열을 가진다.
       */
      expect(sut.getNickname()).toHaveLength(8);
    });

    it('닉네임 변경이 가능하다', () => {
      // Given
      const nickname = faker.person.firstName();

      // When
      sut.changeNickname(nickname);

      // Then
      expect(sut.getNickname()).toBe(nickname);
    });
  });

  describe('프로필 이미지', () => {
    it('프로필 이미지가 없을경우 자동 생성된다', () => {
      expect(sut.getProfile()).toBe(DEFAULT_PROFILE);
    });

    it('프로필 이미지 변경이 가능하다', () => {
      // Given
      const newProfileUrl = faker.image.url();

      // When
      sut.changeProfile(newProfileUrl);

      // Then
      expect(sut.getProfile()).toBe(newProfileUrl);
    });
  });
});
