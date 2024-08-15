import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

@Injectable()
export default class PrismaService extends PrismaClient {
  constructor(private readonly clsService: ClsService) {
    super();

    // TODO: deprecated, extendedPrismaClient로 마이그레이션 필요
    this.$use(async (params, next) => {
      const userId = this.clsService.get('userId') ?? '_system';
      const { action } = params;

      if (userId) {
        const newParams = { ...params };
        if (action === 'create') {
          newParams.args.data.createUser = userId;
          newParams.args.data.updateUser = userId;
          return next(newParams);
        }

        if (action === 'createMany') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updatedData = newParams.args.data.map((data: any) => ({
            ...data,
            createUser: userId,
            updateUser: userId,
          }));
          newParams.args.data = updatedData;

          return next(newParams);
        }

        if (action === 'update') {
          newParams.args.data.updateUser = userId;
          return next(newParams);
        }

        if (action === 'delete' || action === 'deleteMany') {
          newParams.action = 'updateMany';
          Object.assign(newParams.args, { data: { deleteAt: new Date(), deleteUser: userId } });
          return next(newParams);
        }

        if (action === 'findFirst' || action === 'findUnique' || action === 'findMany') {
          newParams.args.where = { ...newParams.args.where, deleteAt: null };

          return next(newParams);
        }
      }
      return next(params);
    });
  }
}
