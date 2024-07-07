import { TestBed } from '@automock/jest';

import TokenService from '../../services/token.service';
import { IMyJwtService, MY_JWT_SERVICE } from '../../../../infra/jwt/interfaces/my-jwt.interface';
import { InvalidJwtTokenException, RefreshTokenExpiredException } from '../../../../common/exceptions/401';

describe('TokenService', () => {
  let sut: TokenService;
  let jwtService: IMyJwtService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(TokenService).compile();
    sut = unit;
    jwtService = unitRef.get<IMyJwtService>(MY_JWT_SERVICE);
  });

  describe('사용자 아이디가 주어지고', () => {
    const userId = 'userId';
    describe('엑세스 토큰을 발급하면', () => {
      it('토큰 발급에 성공한다', () => {
        expect(sut.generateAccessToken(userId)).not.toBeNull();
      });
    });
  });

  describe('사용자 아이디가 주어지고', () => {
    const userId = 'userId';
    describe('리프레시 토큰을 발급하면', () => {
      it('토큰 발급에 성공한다', () => {
        expect(sut.generateRefreshToken(userId)).not.toBeNull();
      });
    });
  });

  describe('유효하지 않은 토큰이 주어지고', () => {
    const token = 'token';
    describe('토큰 검증을 시도하면', () => {
      it('예외가 발생한다', () => {
        expect(() => sut.verify(token)).toThrow(InvalidJwtTokenException);
      });
    });
  });

  describe('유효한 토큰이 주어지고', () => {
    const token = 'token';
    describe('토큰 검증을 시도하면', () => {
      it('유저의 아이디를 반환한다', () => {
        const userId = 'userId';
        jest.spyOn(jwtService, 'verify').mockReturnValue({ userId });
        expect(sut.verify(token)).toBe(userId);
      });
    });
  });

  describe('리프레쉬 토큰이 없는 쿠키가 주어지고', () => {
    const cookie = 'cookie';
    describe('토큰 갱신을 시도하면', () => {
      it('예외가 발생한다', () => {
        expect(() => sut.refresh(cookie)).toThrow(InvalidJwtTokenException);
      });
    });
  });

  describe('유효하지 않은 리프레쉬 토큰이 있는 쿠키가 주어지고', () => {
    const cookie = 'refreshToken=refreshToken';
    describe('토큰 갱신을 시도하면', () => {
      it('예외가 발생한다', () => {
        expect(() => sut.refresh(cookie)).toThrow(RefreshTokenExpiredException);
      });
    });
  });

  describe('유효한 리프레쉬 토큰이 있는 쿠키가 주어지고', () => {
    const cookie = 'refreshToken=refreshToken';
    describe('토큰 갱신을 시도하면', () => {
      it('엑세스 토큰을 반환한다', () => {
        jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 'userId' });

        const result = sut.refresh(cookie);
        expect(result).not.toBeNull();
      });
    });
  });

  describe('쿠키 내부에 accessToken과 refreshToken이 없는 쿠키가 주어지고', () => {
    const cookie = 'cookie';
    describe('쿠키에서 토큰 파싱을 시도하면', () => {
      it('빈값을 반환한다', () => {
        const result = sut.parseJwtTokenByCookie(cookie);
        expect(result).toEqual({ accessToken: '', refreshToken: '' });
      });
    });
  });

  describe('쿠키 내부에 accessToken과 refreshToken이 있는 쿠키가 주어지고', () => {
    const [accessToken, refreshToken] = ['accessToken', 'refreshToken'];
    const cookie = `accessToken=${accessToken}; refreshToken=${refreshToken}`;
    describe('쿠키에서 토큰 파싱을 시도하면', () => {
      it('accessToken과 refreshToken의 값을 반환한다', () => {
        const result = sut.parseJwtTokenByCookie(cookie);
        expect(result).toEqual({ accessToken, refreshToken });
      });
    });
  });
});
