import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { IMyJwtService } from '../../interfaces/my-jwt.interface';
import MyJwtService from '../../services/my-jwt.service';

describe('MyJwtService', () => {
  let sut: IMyJwtService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeAll(() => {
    jwtService = new JwtService();
    configService = new ConfigService();
    sut = new MyJwtService(jwtService, configService);
  });

  describe('토큰을 발급하면', () => {
    it('토큰을 반환한다', () => {
      const result = sut.sign('userId', '1h');
      expect(result).toBeDefined();
    });
  });

  describe('유효하지 않은 토큰이 주어지고', () => {
    const invalidToken = 'invalidToken';
    describe('토큰을 검증하면', () => {
      it('예외가 발생한다', () => {
        expect(() => sut.verify(invalidToken)).toThrow(Error);
      });
    });
  });
});
