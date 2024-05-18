import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

import userRoleSeed from './user/user-role.seed';
import oAuthProviderSeed from './auth/oauth-provider.seed';
import categorySeed from './category/category.seed';

const prisma = new PrismaClient();

// 시딩 데이터에 공통 컬럼을 추가
function addCommonFields<T>(data: T[]): Array<T & { createUser: string; updateUser: string }> {
  return data.map((d) => ({
    ...d,
    createUser: '_system',
    updateUser: '_system',
  }));
}

async function createSeed<T>(data: T[], inserter: (input: T[]) => Promise<unknown>) {
  try {
    await inserter(data);
  } catch (e) {
    Logger.error(e);
  }
}

async function main() {
  // 사용자 역할 시딩
  await createSeed(addCommonFields(userRoleSeed), (data) =>
    prisma.userRoles.createMany({ data, skipDuplicates: true }),
  );

  // OAuth 인증 제공자 시딩
  await createSeed(addCommonFields(oAuthProviderSeed), (data) =>
    prisma.userOAuthProviders.createMany({ data, skipDuplicates: true }),
  );

  // 카테고리 시딩
  // await createSeed(addCommonFields(categorySeed), (data) => prisma.category.createMany({ data, skipDuplicates: true }));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    Logger.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
