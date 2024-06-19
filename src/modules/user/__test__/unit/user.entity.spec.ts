import { DEFAULT_PROFILE } from '../../constants/user.constant';
import UserOAuthProvider, { OAuthProviders } from '../../domain/entities/user-oauth-provider.entity';
import User from '../../domain/entities/user.entity';

describe('User', () => {
  describe('setDefaultProfile', () => {
    it('기본 프로필이 지정된다', () => {
      const user = User.create({});
      user.setDefaultProfile();
      expect(user.profile).toBe(DEFAULT_PROFILE);
    });
  });

  describe('setDefaultNickname', () => {
    it('8자의 무작위 닉네임이 지정된다', () => {
      const user = User.create({});
      user.setDefaultNickname();
      expect(user.nickname).toHaveLength(8);
    });
  });

  describe('generateId', () => {
    it('UUID가 생성되어 아이디로 지정된다', () => {
      const user = User.create({});
      user.generateId();
      expect(user.id).toHaveLength(36);
    });
  });

  describe('isSignupWithOAuth', () => {
    const googleProvider = UserOAuthProvider.create({ provider: OAuthProviders.GOOGLE });
    const kakaoProvider = UserOAuthProvider.create({ provider: OAuthProviders.KAKAO });

    it('OAuth 제공사가 일치하지 않으면 false를 반환한다', () => {
      const user = User.create({ oAuthProvider: googleProvider });
      expect(user.isSignupWithOAuth(kakaoProvider)).toBeFalsy();
    });

    it('OAuth 제공사가 일치하면 true를 반환한다', () => {
      const user = User.create({ oAuthProvider: kakaoProvider });
      expect(user.isSignupWithOAuth(kakaoProvider)).toBeTruthy();
    });
  });
});
