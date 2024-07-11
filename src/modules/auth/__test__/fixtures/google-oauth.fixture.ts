import { GoogleOAuthUserInfo } from '../../../../@types/auth/oauth/google.type';
import { generateCUID } from '../../../../common/utils/cuid';

interface CreateGoogleOAuthUserInfoParams {
  email: string;
}
// eslint-disable-next-line import/prefer-default-export
export const createGoogleOAuthUserInfo = (params: CreateGoogleOAuthUserInfoParams): GoogleOAuthUserInfo => {
  return {
    id: generateCUID(),
    email: params.email,
    verified_email: true,
    name: '',
    given_name: '',
    family_name: '',
    picture: '',
  };
};
