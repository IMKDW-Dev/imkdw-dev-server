import { PrismaClient } from '@prisma/client';

export const PRISMA_SERVICE = 'PRISMA_SERVICE';
const prismaClient = new PrismaClient({});
export const extendedPrismaClient = prismaClient.$extends({
  model: {},
  query: {},
});

export interface ExtendedPrismaClient extends PrismaClient {}
