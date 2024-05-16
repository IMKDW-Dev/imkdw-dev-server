export interface KakaoOAuthToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: string;
  scope: string;
  refresh_token_expires_in: string;
}

export interface KakaoUserInfo {
  id: number;
  connected_at: string;
  properties: {
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_image_needs_agreement: boolean;
    profile: {
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
  };
}
