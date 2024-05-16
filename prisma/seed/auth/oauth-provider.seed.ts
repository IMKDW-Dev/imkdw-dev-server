import { userOAuthProviders } from '@prisma/client';
import OAuthProviders from '../../../src/modules/auth/enums/oauth-provider.enum';

const oAuthProviderSeed: Pick<userOAuthProviders, 'name'>[] = [
  {
    name: OAuthProviders.GOOGLE,
  },
  {
    name: OAuthProviders.GITHUB,
  },
  {
    name: OAuthProviders.KAKAO,
  },
];

export default oAuthProviderSeed;
