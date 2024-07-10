import nock from 'nock';
import { HttpStatus } from '@nestjs/common';

import { createKakaoOAuthToken, createKakaoUserInfo } from '../fixtures/kakao-oauth.fixture';

export const mockKakaoGetAccessTokenApi = () => {
  const baseURL = 'https://kauth.kakao.com';
  const path = '/oauth/token';

  return nock(baseURL).post(path).reply(HttpStatus.OK, createKakaoOAuthToken());
};

export const mockKakaoOAuthGetUserInfoApi = (email: string) => {
  const baseURL = 'https://kapi.kakao.com';
  const path = '/v2/user/me';

  return nock(baseURL).get(path).reply(HttpStatus.OK, createKakaoUserInfo(email));
};
