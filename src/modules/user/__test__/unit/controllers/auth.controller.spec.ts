import { TestBed } from '@automock/jest';
import { Response } from 'express';

import AuthController from '../../../../auth/controllers/auth.controller';
import { COOKIE_SERVICE, ICookieService } from '../../../../../infra/secure/cookie/interfaces/cookie.interface';
import AuthService from '../../../../auth/services/auth.service';

describe('AuthController', () => {
  let sut: AuthController;
  let authService: AuthService;
  let cookieService: ICookieService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();
    sut = unit;

    authService = unitRef.get<AuthService>(AuthService);
    cookieService = unitRef.get<ICookieService>(COOKIE_SERVICE);
  });

  describe('만료된 토큰 갱신', () => {
    it('토큰 갱신에 성공시 새로운 엑세스토큰을 설정한다', () => {
      // Given
      const cookie = 'expired-token';
      const res = { cookie: jest.fn() } as unknown as Response;
      const newAccessToken = 'refreshedAccessToken';
      jest.spyOn(authService, 'refreshToken').mockReturnValue(newAccessToken);

      // When
      sut.refresh(cookie, res);

      // then
      expect(cookieService.setCookie).toHaveBeenCalledWith('accessToken', newAccessToken, expect.any(Number), res);
    });
  });

  describe('로그아웃', () => {
    it('로그아웃에 성공시 엑세스, 리프레쉬 토큰을 제거한다', () => {
      // Given
      const res = { clearCookie: jest.fn() } as unknown as Response;

      // When
      sut.logout(res);

      // Then
      expect(cookieService.clearCookie).toHaveBeenCalledWith(res, ['accessToken', 'refreshToken']);
    });
  });
});
