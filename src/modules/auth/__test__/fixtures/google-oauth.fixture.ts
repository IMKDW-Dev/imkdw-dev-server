import { GoogleOAuthUserInfo } from '../../../../@types/auth/oauth/google.type';

interface CreateGoogleOAuthUserInfoParams {
  id: string;
  email: string;
}
// eslint-disable-next-line import/prefer-default-export
export const createGoogleOAuthUserInfo = (params: CreateGoogleOAuthUserInfoParams): GoogleOAuthUserInfo => {
  return {
    id: params.id,
    email: params.email,
    verified_email: true,
    name: '',
    given_name: '',
    family_name: '',
    picture: '',
    locale: '',
    hd: '',
  };
};
