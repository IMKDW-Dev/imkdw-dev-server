import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

import TokenService from '../../../services/token.service';
import { InvalidJwtTokenException, RefreshTokenExpiredException } from '../../../../../common/exceptions/401';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test',
        }),
        ConfigModule.forRoot(),
      ],
      providers: [TokenService],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  describe('엑세스 토큰 생성', () => {
    it('생성된 엑세스 토큰을 반환한다', () => {
      // Given
      const userId = 'userId';

      // When
      const sut = tokenService.generateAccessToken(userId);

      // Then
      expect(sut).not.toBeNull();
    });
  });

  describe('리프레쉬 토큰 생성', () => {
    it('생성된 리프레시 토큰을 반환한다', () => {
      // Given
      const userId = 'userId';

      // When
      const sut = tokenService.generateRefreshToken(userId);

      // Then
      expect(sut).not.toBeNull();
    });
  });

  describe('토큰 검증', () => {
    it('유효하지 않은 토큰의 경우 InvalidJwtTokenException 예외가 발생한다', () => {
      // Given
      const token = 'token';

      // When, Then
      expect(() => tokenService.verify(token)).toThrow(InvalidJwtTokenException);
    });

    it('유효한 토큰의 경우 유저의 아이디가 반환횐다', () => {
      // Given
      const userId = 'userId';
      const token = sign({ userId }, 'test');

      // When
      const sut = tokenService.verify(token);

      // Then
      expect(sut).toBe(userId);
    });
  });

  describe('토큰 재발급', () => {
    it('리프레시 토큰이 없는 경우 InvalidJwtTokenException 예외가 발생한다', () => {
      // Given
      const cookie = '';

      // When, Then
      expect(() => tokenService.refresh(cookie)).toThrow(InvalidJwtTokenException);
    });

    it('리프레시 토큰이 만료된 경우 RefreshTokenExpiredException 예외가 발생한다', () => {
      // Given
      const cookie = 'refreshToken=token';

      // When, Then
      expect(() => tokenService.refresh(cookie)).toThrow(RefreshTokenExpiredException);
    });

    it('리프레시 토큰이 유효한 경우 엑세스 토큰을 반환한다', () => {
      // Given
      const userId = 'userId';
      const refreshToken = sign({ userId }, 'test');
      const cookie = `refreshToken=${refreshToken}`;

      // When
      const sut = tokenService.refresh(cookie);

      // Then
      expect(sut).not.toBeNull();
    });
  });
});
