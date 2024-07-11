import nock from 'nock';
import { HttpStatus } from '@nestjs/common';

import { createGoogleOAuthUserInfo } from '../fixtures/google-oauth.fixture';

// eslint-disable-next-line import/prefer-default-export
export const mockGoogleOAuthGetUserInfoApi = (email: string) => {
  const baseURL = 'https://www.googleapis.com';
  const path = '/oauth2/v2/userinfo';

  return nock(baseURL).get(path).reply(HttpStatus.OK, createGoogleOAuthUserInfo({ email }));
};
