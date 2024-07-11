import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

import { testGoogleOAuth } from '../e2e/features/test_google_oauth';
import { userRoles } from '../../../user/domain/models/user-role.model';

// eslint-disable-next-line import/prefer-default-export
export const registerNewUser = async (app: INestApplication, role: string) => {
  let response: request.Response;

  response = await testGoogleOAuth(app);
  const { userId } = response.body.data;
  if (role === userRoles.admin.name) {
    await new PrismaClient().users.update({
      where: { id: userId },
      data: { roleId: userRoles.admin.id },
    });
    response = await testGoogleOAuth(app);
  }

  const cookies = response.headers['set-cookie'];

  return { cookies, userId };
};
