import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import TokenService from '../../services/token.service';
import { IMyJwtService, MY_JWT_SERVICE } from '../../../../infra/jwt/interfaces/my-jwt.interface';
import { InvalidJwtTokenException, RefreshTokenExpiredException } from '../../../../common/exceptions/401';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: IMyJwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: MY_JWT_SERVICE,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<IMyJwtService>(MY_JWT_SERVICE);
  });

  describe('엑세스 토큰 발급', () => {
    it('토큰 발급에 성공한다', () => {
      // Given
      const userId = 'userId';

      // When
      const sut = tokenService.generateAccessToken(userId);

      // Then
      expect(sut).not.toBeNull();
    });
  });

  describe('리프레시 토큰 발급', () => {
    it('토큰 발급에 성공한다', () => {
      // Given
      const userId = 'userId';

      // When
      const sut = tokenService.generateRefreshToken(userId);

      // Then
      expect(sut).not.toBeNull();
    });
  });

  describe('토큰 검증', () => {
    it('토큰 검증에 실패시 InvalidJwtTokenException 에러가 발생한다', () => {
      // Given
      const token = 'token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      // When, Then
      expect(() => tokenService.verify(token)).toThrow(InvalidJwtTokenException);
    });

    it('토큰 검증에 성공시 유저의 아이디를 반환한다', () => {
      // Given
      const token = 'token';
      const userId = 'userId';
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId });

      // When
      const sut = tokenService.verify(token);

      // Then
      expect(sut).toBe(userId);
    });
  });

  describe('토큰 갱신', () => {
    it('쿠키 내부에 리프레시 토큰이 없을 경우 InvalidJwtTokenException 에러가 발생한다', () => {
      // Given
      const cookie = 'cookie';

      // When, Then
      expect(() => tokenService.refresh(cookie)).toThrow(InvalidJwtTokenException);
    });

    it('리프레쉬 토큰이 만료된 경우 RefreshTokenExpiredException 에러가 발생한다', () => {
      // Given
      const cookie = 'refreshToken=refreshToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      // When, Then
      expect(() => tokenService.refresh(cookie)).toThrow(RefreshTokenExpiredException);
    });

    it('토큰 갱신 성공시 토큰을 반환한다', () => {
      // Given
      const cookie = 'refreshToken=refreshToken';
      const userId = 'userId';
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId });
      jest.spyOn(tokenService, 'generateAccessToken').mockReturnValue('token');

      // When
      const sut = tokenService.refresh(cookie);

      // Then
      expect(sut).toBe('token');
    });
  });

  describe('쿠키 내부의 토큰 파싱', () => {
    it('쿠키 내부에 accessToken이 없을경우 빈값을 반환한다', () => {
      // Given
      const cookie = 'refreshToken=refreshToken';

      // When
      const sut = tokenService.parseJwtTokenByCookie(cookie);

      // Then
      expect(sut.accessToken).toBe('');
    });

    it('쿠키 내부에 refreshToken이 없을경우 빈값을 반환한다', () => {
      // Given
      const cookie = 'accessToken=accessToken';

      // When
      const sut = tokenService.parseJwtTokenByCookie(cookie);

      // Then
      expect(sut.refreshToken).toBe('');
    });

    it('쿠키 내부에 accessToken과 refreshToken이 있을경우 값을 반환한다', () => {
      // Given
      const cookie = 'accessToken=accessToken; refreshToken=refreshToken';

      // When
      const sut = tokenService.parseJwtTokenByCookie(cookie);

      // Then
      expect(sut.accessToken).toBe('accessToken');
      expect(sut.refreshToken).toBe('refreshToken');
    });
  });
});
