import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import request from 'supertest';
import Authorization from '../../../decorators/authorization.decorator';

@Controller('test')
class TestController {
  @Get()
  test(@Authorization() token: string) {
    return { token };
  }
}

describe('Authorization Decorator', () => {
  const generateBearerToken = (token: string) => `Bearer ${token}`;

  let app: INestApplication;
  const API_PATH = '/test';
  const AuthorizationHeader = 'Authorization';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authorization Header가 없으면', () => {
    it('빈 문자열을 반환한다', () => {
      return request(app.getHttpServer()).get(API_PATH).expect({ token: '' });
    });
  });

  describe('Bearer 형식이 아닌 Authorization 헤더가 주어지고', () => {
    const token = 'imkdw';
    describe('Authorization 데이터를 추출하면', () => {
      it('빈 문자열을 반환한다', () => {
        return request(app.getHttpServer()).get(API_PATH).set(AuthorizationHeader, token).expect({ token: '' });
      });
    });
  });

  describe('Authorization Header 내부에 Bearer 토큰이 주어지고', () => {
    const token = generateBearerToken('imkdw');
    describe('Authorization 데이터를 추출하면', () => {
      it('Bearer을 제외한 내용을 반환한다', () => {
        return request(app.getHttpServer()).get(API_PATH).set(AuthorizationHeader, token).expect({ token: 'imkdw' });
      });
    });
  });
});
