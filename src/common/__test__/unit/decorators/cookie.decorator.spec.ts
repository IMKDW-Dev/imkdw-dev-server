import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import request from 'supertest';
import Cookie from '../../../decorators/cookie.decorator';

@Controller('test')
class TestController {
  @Get()
  test(@Cookie() cookie: string) {
    return { cookie };
  }
}

describe('Cookie Decorator', () => {
  const generateCookie = (cookie: string) => `someCookie=${cookie}`;

  let app: INestApplication;
  const API_PATH = '/test';
  const CookieHeader = 'Cookie';

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

  describe('쿠키가 아예 없으면', () => {
    it('빈 문자열을 반환한다', () => {
      return request(app.getHttpServer()).get(API_PATH).expect({ cookie: '' });
    });
  });

  describe('빈 문자열이 value로 주어지고', () => {
    const cookie = generateCookie('');
    describe('쿠키 데이터를 추출하면', () => {
      it('빈 문자열을 반환한다', () => {
        return request(app.getHttpServer()).get(API_PATH).set(CookieHeader, cookie).expect({ cookie: 'someCookie=' });
      });
    });
  });

  describe('쿠키가 주어지고', () => {
    const cookie = generateCookie('imkdw');
    describe('쿠키 데이터를 추출하면', () => {
      it('쿠키를 제외한 내용을 반환한다', () => {
        return request(app.getHttpServer()).get(API_PATH).set(CookieHeader, cookie).expect({ cookie });
      });
    });
  });
});
