import { Response } from 'express';
import { CookieMaxage } from '../../../enums/cookie.enum';
import { ICookieService } from '../../../interfaces/cookie.interface';
import CookieService from '../../../services/cookie.service';

describe('CookieService', () => {
  let sut: ICookieService;

  beforeAll(() => {
    sut = new CookieService();
  });

  describe('현재 환경이 프로덕션인 경우', () => {
    describe('쿠키를 설정하면', () => {
      it('secure: true인 상태로 설정한다', () => {
        process.env.NODE_ENV = 'production';
        const res = { cookie: jest.fn() } as unknown as Response;
        sut.setCookie('key', 'value', CookieMaxage.HOUR_1, res);
        expect(res.cookie).toHaveBeenCalledWith('key', 'value', {
          domain: process.env.COOKIE_DOMAIN,
          httpOnly: true,
          path: '/',
          secure: true,
          maxAge: CookieMaxage.HOUR_1,
          sameSite: 'lax',
        });
      });
    });
  });

  describe('현재 환경이 로컬인 경우', () => {
    describe('쿠키를 설정하면', () => {
      it('secure: false인 상태로 설정한다', () => {
        process.env.NODE_ENV = 'local';
        const res = { cookie: jest.fn() } as unknown as Response;
        sut.setCookie('key', 'value', CookieMaxage.HOUR_1, res);
        expect(res.cookie).toHaveBeenCalledWith('key', 'value', {
          domain: process.env.COOKIE_DOMAIN,
          httpOnly: true,
          path: '/',
          secure: false,
          maxAge: CookieMaxage.HOUR_1,
          sameSite: 'lax',
        });
      });
    });
  });

  describe('쿠키를 삭제하면', () => {
    it('쿠키를 삭제한다', () => {
      const res = { clearCookie: jest.fn() } as unknown as Response;
      sut.clearCookie(res, ['key1', 'key2']);
      expect(res.clearCookie).toHaveBeenNthCalledWith(1, 'key1', {
        domain: process.env.COOKIE_DOMAIN,
      });
      expect(res.clearCookie).toHaveBeenNthCalledWith(2, 'key2', {
        domain: process.env.COOKIE_DOMAIN,
      });
    });
  });
});
