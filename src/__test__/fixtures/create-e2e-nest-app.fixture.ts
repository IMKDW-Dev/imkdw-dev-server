import { Test } from '@nestjs/testing';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import AppModule from '../../app.module';

const createTestApp = async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  return app;
};

export default createTestApp;
