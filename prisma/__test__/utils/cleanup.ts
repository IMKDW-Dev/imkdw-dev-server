import { Prisma } from '@prisma/client';
import PrismaService from '../../../src/infra/database/prisma.service';

// eslint-disable-next-line import/prefer-default-export
export const cleanupDatabase = async (prisma: PrismaService) => {
  const tables: { TABLE_NAME: string }[] = await prisma.$queryRaw`
    SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'test';
  `;

  const filteredTables = tables.filter(({ TABLE_NAME }) => {
    const seedTables = ['oauthproviders', 'userroles'];
    return !seedTables.includes(TABLE_NAME.toLowerCase());
  });

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

    const truncatePromises = filteredTables.map(async ({ TABLE_NAME }) =>
      tx.$executeRaw(Prisma.sql`TRUNCATE TABLE ${Prisma.raw(TABLE_NAME)}`),
    );

    await Promise.all(truncatePromises);

    await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
  });
};
