import { PrismaClient } from '@prisma/client';
import { ILocalStorageService } from '../local-storage/interfaces/local-storage.interface';

export const PRISMA_SERVICE = 'PRISMA_SERVICE';
const prismaClient = new PrismaClient({});
export const extendedPrismaClient = (localStorageService: ILocalStorageService) =>
  prismaClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ query, operation, args }) {
          const userId = localStorageService.getUserId() ?? '_system';
          const tempArgs = { ...args };

          if (operation === 'create') {
            Object.assign(tempArgs, { ...args, data: { ...args.data, createUser: userId, updateUser: userId } });
          }

          if (operation === 'update') {
            Object.assign(tempArgs, { ...args, data: { ...args.data, updateUser: userId } });
          }

          return query(tempArgs);
        },
      },
    },
  });

export interface ExtendedPrismaClient extends PrismaClient {}
