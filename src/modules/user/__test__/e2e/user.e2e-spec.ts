import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import createTestApp from '../../../../__test__/fixtures/create-e2e-nest-app.fixture';
import PrismaService from '../../../../infra/database/prisma.service';
import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';
import { testGoogleOAuth } from '../../../auth/__test__/e2e/features/test_google_oauth';
import { testGetUserInfo } from './features/test_get_user_info';
import { DEFAULT_PROFILE } from '../../constants/user.constant';
import { userRoles } from '../../domain/models/user-role.model';
import { testUpdateUserNickname } from './features/test_update_user_nickname';
import { testUpdateUserProfile } from './features/test_update_user_profile';
import { IStorageService } from '../../../../infra/storage/interfaces/storage.interface';
import { generateMulterFile } from '../../../../__test__/fixtures/create-multer-file.fixture';
import ContentType from '../../../../infra/storage/enums/s3-content-type.enum';

describe('OAuth', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let storageService: IStorageService;

  beforeAll(async () => {
    const testApps = await createTestApp();
    app = testApps.app;
    prisma = testApps.prisma;
    storageService = testApps.storageService;
    app.init();
  });

  beforeEach(async () => cleanupDatabase(prisma));

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/users/:userId', () => {
    let response: request.Response;

    describe('유저 정보를 조회하면', () => {
      it('유저 정보가 반환된다', async () => {
        const registerResponse = await testGoogleOAuth(app);
        const cookies = registerResponse.headers['set-cookie'];
        const { userId } = registerResponse.body.data;

        response = await testGetUserInfo(app, userId, cookies);
        expect(response.body.data.id).toBe(userId);
        expect(response.body.data.nickname).toHaveLength(8);
        expect(response.body.data.profile).toBe(DEFAULT_PROFILE);
        expect(response.body.data.role).toBe(userRoles.normal.name);
      });
    });
  });

  describe('PATCH /v1/users/:userId', () => {
    let response: request.Response;

    describe('닉네임을 수정하면', () => {
      const newNickname = 'newName';
      it('닉네임을 저장하고 유저 정보를 반환한다', async () => {
        const registerResponse = await testGoogleOAuth(app);
        const cookies = registerResponse.headers['set-cookie'];
        const { userId } = registerResponse.body.data;

        response = await testUpdateUserNickname(app, userId, cookies, newNickname);
        expect(response.body.data.nickname).toBe(newNickname);
      });
    });

    describe('프로필 이미지를 수정하면', () => {
      const uploadedUrl = 'https://image.com/newProfile.png';
      const image = generateMulterFile();
      const imageExt = image.originalname.split('.').pop();

      it('프로필 이미지를 저장하고 유저 정보를 반환한다', async () => {
        const registerResponse = await testGoogleOAuth(app);
        const cookies = registerResponse.headers['set-cookie'];
        const { userId } = registerResponse.body.data;

        const uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);

        response = await testUpdateUserProfile(app, userId, cookies, image);
        expect(response.body.data.profile).toBe(uploadedUrl);
        expect(uploadSpy).toHaveBeenNthCalledWith(
          1,
          `users/${userId}/original.${imageExt}`,
          expect.anything(),
          ContentType.IMAGE,
        );

        expect(uploadSpy).toHaveBeenNthCalledWith(
          2,
          expect.stringMatching(new RegExp(`^users/${userId}/[^/]+\\.webp$`)),
          expect.anything(),
          ContentType.IMAGE,
        );
      });
    });
  });
});
