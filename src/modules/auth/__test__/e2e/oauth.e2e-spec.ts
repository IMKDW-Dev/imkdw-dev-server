import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import nock from 'nock';

import createTestApp from '../../../../__test__/fixtures/create-e2e-nest-app.fixture';
import { mockGoogleOAuthGetUserInfoApi } from '../helpers/google-oauth.helper';
import { mockKakaoGetAccessTokenApi, mockKakaoOAuthGetUserInfoApi } from '../helpers/kakao-oauth.helper';
import PrismaService from '../../../../infra/database/prisma.service';
import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';
import { mockGithubGetAccessTokenApi, mockGithubOAuthGetUserInfoApi } from '../helpers/github-oauth.helper';

describe('OAuth', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testApps = await createTestApp();
    app = testApps.app;
    prisma = testApps.prisma;
    app.init();
  });

  beforeEach(async () => cleanupDatabase(prisma));

  afterEach(() => nock.cleanAll());

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/oauth/google', () => {
    let response: request.Response;

    beforeAll(() => mockGoogleOAuthGetUserInfoApi('imkdw@imkdw.dev'));

    describe('구글 OAuth 인증을 진행하면', () => {
      it('사용자의 아이디가 반환되고', async () => {
        response = await request(app.getHttpServer())
          .post('/v1/oauth/google')
          .set('Authorization', 'Bearer accessToken')
          .expect(HttpStatus.CREATED);

        // 유저 아이디는 UUID 형식이다.
        expect(response.body.data.userId).toHaveLength(36);
      });

      it('accessToken, refreshToken 쿠키가 설정된다', async () => {
        const setCookie = response.headers['set-cookie'];

        expect(setCookie).toHaveLength(2);
        expect(setCookie[0].includes('accessToken')).toBeTruthy();
        expect(setCookie[1].includes('refreshToken')).toBeTruthy();
      });
    });
  });

  describe('POST /v1/oauth/kakao', () => {
    let response: request.Response;

    beforeAll(() => {
      mockKakaoGetAccessTokenApi();
      mockKakaoOAuthGetUserInfoApi('imkdw@imkdw.dev');
    });

    describe('카카오 OAuth 인증을 진행하면', () => {
      it('사용자의 아이디가 반환되고', async () => {
        response = await request(app.getHttpServer())
          .post('/v1/oauth/kakao')
          .set('Authorization', 'Bearer accessToken')
          .send({ code: 'code', redirectUri: 'redirectUri' })
          .expect(HttpStatus.CREATED);

        // 유저 아이디는 UUID 형식이다.
        expect(response.body.data.userId).toHaveLength(36);
      });

      it('accessToken, refreshToken 쿠키가 설정된다', async () => {
        const setCookie = response.headers['set-cookie'];

        expect(setCookie).toHaveLength(2);
        expect(setCookie[0].includes('accessToken')).toBeTruthy();
        expect(setCookie[1].includes('refreshToken')).toBeTruthy();
      });
    });
  });

  describe('POST /v1/oauth/github', () => {
    let response: request.Response;

    beforeAll(() => {
      mockGithubGetAccessTokenApi();
      mockGithubOAuthGetUserInfoApi('imkdw@imkdw.dev');
    });

    describe('깃허브 OAuth 인증을 진행하면', () => {
      it('사용자의 아이디가 반환되고', async () => {
        response = await request(app.getHttpServer())
          .post('/v1/oauth/github')
          .set('Authorization', 'Bearer accessToken')
          .send({ code: 'code', redirectUri: 'redirectUri' })
          .expect(HttpStatus.CREATED);

        // 유저 아이디는 UUID 형식이다.
        expect(response.body.data.userId).toHaveLength(36);
      });

      it('accessToken, refreshToken 쿠키가 설정된다', async () => {
        const setCookie = response.headers['set-cookie'];
        expect(setCookie).toHaveLength(2);
        expect(setCookie[0].includes('accessToken')).toBeTruthy();
        expect(setCookie[1].includes('refreshToken')).toBeTruthy();
      });
    });
  });
});
