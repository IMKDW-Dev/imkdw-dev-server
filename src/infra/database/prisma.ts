import { PrismaClient } from '@prisma/client';

export const extendedPrismaClient = (base: PrismaClient) => {
  return base.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          const tempArgs = { ...args };
          tempArgs.where = { ...tempArgs.where, deleteAt: null };
          return query(tempArgs);
        },
      },
    },
  });
};

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: ConstructorParameters<typeof PrismaClient>[0]) {
    super(options);

    // eslint-disable-next-line no-constructor-return
    return extendedPrismaClient(this) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => ReturnType<typeof extendedPrismaClient>;

export { ExtendedPrismaClient };
