import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ExecutionContext } from '@nestjs/common';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsModule, ClsService } from 'nestjs-cls';
import { Request } from 'express';

import DatabaseModule from '../../infra/database/database.module';
import PrismaService from '../../infra/database/prisma.service';

export default function createClsModule() {
  return ClsModule.forRoot({
    global: true,
    interceptor: {
      mount: true,
      setup: (cls: ClsService, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>();
        const userId = request.user?.userId;
        cls.set('userId', userId);
      },
    },
    plugins: [
      new ClsPluginTransactional({
        imports: [DatabaseModule],
        adapter: new TransactionalAdapterPrisma({
          prismaInjectionToken: PrismaService,
        }),
      }),
    ],
  });
}
