import { TestBed } from '@automock/jest';

import TokenService from '../../../token/services/token.service';
import UserService from '../../../user/services/user.service';
import AuthService from '../../services/auth.service';
import UserOAuthProvider from '../../../user/domain/models/user-oauth-provider.model';
import { createUser } from '../../../../__test__/fixtures/user/create-user.test-fixture';
import { generateUUID } from '../../../../common/utils/uuid';

describe('AuthService', () => {
  let sut: AuthService;
  let tokenService: TokenService;
  let userService: UserService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();
    sut = unit;
    tokenService = unitRef.get(TokenService);
    userService = unitRef.get(UserService);
  });

  describe('로그인', () => {
    it('유저 아이디와 토큰을 반환한다', () => {
      // Given
      const [userId, accessToken, refreshToken] = ['userId', 'accessToken', 'refreshToken'];
      jest.spyOn(tokenService, 'generateAccessToken').mockReturnValue(accessToken);
      jest.spyOn(tokenService, 'generateRefreshToken').mockReturnValue(refreshToken);

      // When
      const result = sut.login(userId);

      // Then
      expect(result).toEqual({ userId, accessToken, refreshToken });
    });
  });

  describe('회원가입', () => {
    it('유저를 생성하고 유저아이디, 토큰을 반환한다', async () => {
      // Given
      const [email, oAuthProvider] = ['email', UserOAuthProvider.GOOGLE];
      const [userId, accessToken, refreshToken] = [generateUUID(), 'accessToken', 'refreshToken'];
      const user = createUser({ id: userId });

      jest.spyOn(userService, 'createUser').mockResolvedValue(user);
      jest.spyOn(sut, 'login').mockReturnValue({ userId, accessToken, refreshToken });

      // When
      const result = await sut.register(email, oAuthProvider);

      // Then
      expect(result).toEqual({ userId, accessToken, refreshToken });
    });
  });

  describe('토큰 갱신', () => {
    it('갱신된 토큰을 반환한다', () => {
      // Given
      const cookies = 'cookies';
      const newToken = 'newToken';
      jest.spyOn(tokenService, 'refresh').mockReturnValue(newToken);

      // When
      const result = sut.refreshToken(cookies);

      // Then
      expect(result).toEqual(newToken);
    });
  });
});
