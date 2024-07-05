import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';
import { generateMulterFile } from '../../../../__test__/fixtures/create-multer-file.fixture';
import IntegrationTestModule from '../../../../__test__/modules/integration-test.module';
import { UserNotFoundException } from '../../../../common/exceptions/404';
import { generateUUID } from '../../../../common/utils/uuid';
import PrismaService from '../../../../infra/database/prisma.service';
import { IStorageService, STORAGE_SERVICE } from '../../../../infra/storage/interfaces/storage.interface';
import UserOAuthProvider from '../../domain/models/user-oauth-provider.model';
import UserRole from '../../domain/models/user-role.model';
import { IUserRepository, USER_REPOSITORY } from '../../repository/user/user-repo.interface';
import UserService from '../../services/user.service';
import { createUser } from '../fixtures/create-user.fixture';

describe('UserIntegration', () => {
  let userService: UserService;
  let userRepository: IUserRepository;
  let storageService: IStorageService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await IntegrationTestModule.create();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<IUserRepository>(USER_REPOSITORY);
    storageService = moduleRef.get<IStorageService>(STORAGE_SERVICE);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('유저 생성', () => {
    it('생성된 유저를 반환한다', async () => {
      // Given
      const email = 'email';
      const oAuthProvider = UserOAuthProvider.GOOGLE;

      // When
      const result = await userService.createUser(email, oAuthProvider);

      // Then
      expect(result.getEmail()).toBe(email);
      expect(result.getOAuthProviderId()).toBe(oAuthProvider.getId());
    });
  });

  describe('유저 정보 조회', () => {
    it('유저가 없는경우 UserNotFoundException 에러가 발생한다', async () => {
      // Given
      const userId = 'userId';

      // When, Then
      await expect(userService.getUserInfo(userId)).rejects.toThrow(UserNotFoundException);
    });

    it('유저 정보를 반환한다', async () => {
      // Given
      const [userId, email, profile, nickname] = [generateUUID(), 'email', 'profile', 'nickname'];
      const user = createUser({ id: userId, email, profile, nickname });
      await userRepository.save(user);

      // When
      const result = await userService.getUserInfo(userId);

      // Then
      expect(result).toEqual({
        id: userId,
        nickname,
        profile,
        role: UserRole.NORMAL.toString(),
      });
    });
  });

  describe('유저 정보 수정', () => {
    it('유저가 없는경우 UserNotFoundException 에러가 발생한다', async () => {
      // Given
      const userId = generateUUID();

      // When, Then
      await expect(userService.updateUser(userId, {})).rejects.toThrow(UserNotFoundException);
    });

    describe('프로필 이미지 변경', () => {
      it('원본 프로필 이미지와 썸네일 이미지를 모두 저장하고 유저 정보를 반환한다', async () => {
        // Given
        const [userId, email, profile, nickname] = [generateUUID(), 'email', 'profile', 'nickname'];
        const user = createUser({ id: userId, email, profile, nickname });
        await userRepository.save(user);

        const profileImageUrl = 'https://image.com';
        jest.spyOn(storageService, 'upload').mockResolvedValue(profileImageUrl);

        // When
        const result = await userService.updateUser(userId, { profileImage: generateMulterFile() });

        // Then
        expect(result).toEqual({
          id: userId,
          nickname,
          profile: profileImageUrl,
          role: UserRole.NORMAL.toString(),
        });

        /**
         * 원본 이미지와 썸네일 이미지를 모두 업로드하므로 2번 호출하게 된다.
         */
        expect(storageService.upload).toHaveBeenCalledTimes(2);
      });
    });

    it('닉네임을 변경하고 유저 정보를 반환한다', async () => {
      // Given
      const [userId, email, profile, nickname] = [generateUUID(), 'email', 'profile', 'nickname'];
      const user = createUser({ id: userId, email, profile, nickname });
      await userRepository.save(user);

      const newNickname = 'newName';
      // When
      const result = await userService.updateUser(userId, { nickname: newNickname });

      // Then
      expect(result).toEqual({
        id: userId,
        nickname: newNickname,
        profile,
        role: UserRole.NORMAL.toString(),
      });
    });
  });
});
