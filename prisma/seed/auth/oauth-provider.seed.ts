import { userOAuthProviders } from '@prisma/client';
import { OAuthProviders } from '../../../src/modules/user/domain/entities/user-oauth-provider.entity';

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
