import { PRISMA_SERVICE, extendedPrismaClient } from '../infra/database/prisma';
import { ILocalStorageService, LOCAL_STORAGE_SERVICE } from '../infra/local-storage/interfaces/local-storage.interface';
import LocalStorageModule from '../infra/local-storage/local-storage.module';

// eslint-disable-next-line import/prefer-default-export
export const prismaConfig = {
  imports: [LocalStorageModule],
  name: PRISMA_SERVICE,
  isGlobal: true,
  inject: [LOCAL_STORAGE_SERVICE],
  useFactory: (localStorageService: ILocalStorageService) => extendedPrismaClient(localStorageService),
};
