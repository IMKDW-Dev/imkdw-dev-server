import { KakaoOAuthToken, KakaoUserInfo } from '../../../../@types/auth/oauth/kakao.type';

// eslint-disable-next-line import/prefer-default-export
export const createKakaoOAuthToken = (): KakaoOAuthToken => {
  return {
    access_token: '',
    expires_in: '',
    refresh_token: '',
    refresh_token_expires_in: '',
    scope: '',
    token_type: '',
  };
};

export const createKakaoUserInfo = (email: string): KakaoUserInfo => {
  return {
    id: 1,
    connected_at: 'string',
    properties: {
      profile_image: 'string',
      thumbnail_image: 'string',
    },
    kakao_account: {
      profile_image_needs_agreement: true,
      profile: {
        thumbnail_image_url: 'string',
        profile_image_url: 'string',
        is_default_image: true,
      },
      has_email: true,
      email_needs_agreement: true,
      is_email_valid: true,
      is_email_verified: true,
      email,
    },
  };
};
