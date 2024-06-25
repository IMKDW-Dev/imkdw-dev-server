import { userOAuthProviders } from '@prisma/client';
import { oAuthProviders } from '../../../src/modules/user/domain/models/user-oauth-provider.model';

const oAuthProviderSeed: Pick<userOAuthProviders, 'id' | 'name'>[] = [
  {
    id: oAuthProviders.google.id,
    name: oAuthProviders.google.provider,
  },
  {
    id: oAuthProviders.github.id,
    name: oAuthProviders.github.provider,
  },
  {
    id: oAuthProviders.kakao.id,
    name: oAuthProviders.kakao.provider,
  },
];

export default oAuthProviderSeed;
