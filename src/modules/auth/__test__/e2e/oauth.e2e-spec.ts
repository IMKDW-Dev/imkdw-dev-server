import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import nock from 'nock';

import createTestApp from '../../../../__test__/fixtures/create-e2e-app.fixture';
import { mockKakaoGetAccessTokenApi, mockKakaoOAuthGetUserInfoApi } from '../helpers/kakao-oauth.helper';
import PrismaService from '../../../../infra/database/prisma.service';
import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';
import { mockGithubGetAccessTokenApi, mockGithubOAuthGetUserInfoApi } from '../helpers/github-oauth.helper';
import { testGoogleOAuth } from './features/test_google_oauth';
import { testKakaoOAuth } from './features/test_kakao_oauth';
import { testGithubOAuth } from './features/test_github_oauth';

describe('OAuth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testApps = await createTestApp();
    app = testApps.app;
    prisma = testApps.prisma;
    app.init();
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterEach(() => nock.cleanAll());

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/oauth/google', () => {
    let response: request.Response;

    describe('구글 OAuth 인증을 진행하면', () => {
      it('사용자의 아이디가 반환되고', async () => {
        response = await testGoogleOAuth(app);
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
        response = await testKakaoOAuth(app);
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
        response = await testGithubOAuth(app);
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
