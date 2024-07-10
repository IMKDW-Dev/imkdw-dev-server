import { Test } from '@nestjs/testing';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import AppModule from '../../app.module';
import { LOGGER } from '../../infra/logger/interfaces/logger.interface';
import PrismaService from '../../infra/database/prisma.service';

const createTestApp = async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(LOGGER)
    .useValue({
      info: () => {},
      debug: () => {},
      error: () => {},
    })
    .compile();

  const configService = module.get<ConfigService>(ConfigService);
  const prisma = module.get<PrismaService>(PrismaService);

  const app = module.createNestApplication();
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  return { app, configService, prisma };
};

export default createTestApp;
