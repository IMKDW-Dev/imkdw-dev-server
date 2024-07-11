import nock from 'nock';
import { HttpStatus } from '@nestjs/common';

import { createGithubOAuthToken, createGithubUserInfo } from '../fixtures/github-oauth.fixture';

export const mockGithubGetAccessTokenApi = () => {
  const baseURL = 'https://github.com/login';
  const path = '/oauth/access_token';

  return nock(baseURL).post(path).reply(HttpStatus.OK, createGithubOAuthToken());
};

export const mockGithubOAuthGetUserInfoApi = (email: string) => {
  const baseURL = 'https://api.github.com';
  const path = '/user';

  return nock(baseURL).get(path).reply(HttpStatus.OK, createGithubUserInfo(email));
};
