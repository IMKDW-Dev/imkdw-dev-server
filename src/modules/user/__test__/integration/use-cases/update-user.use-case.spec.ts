import { Test } from '@nestjs/testing';
import UpdateUserUseCase from '../../../use-cases/update-user.use-case';
import createClsModule from '../../../../../common/modules/cls.module';
import { UserNotFoundException } from '../../../../../common/exceptions/404';
import { createUser } from '../../fixtures/create-user.fixture';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../infra/database/prisma.service';
import { IUserRepository, USER_REPOSITORY } from '../../../interfaces/user-repo.interface';
import UserRepository from '../../../infra/user.repository';
import UserImageService from '../../../services/user-image.service';
import ImageModule from '../../../../../infra/image/image.module';
import StorageModule from '../../../../../infra/storage/storage.module';
import { IStorageService, STORAGE_SERVICE } from '../../../../../infra/storage/interfaces/storage.interface';
import createConfigModule from '../../../../../common/modules/config.module';
import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';

describe('UpdateUserUseCase', () => {
  const user = createUser({ email: 'email', nickname: 'nickname', profile: 'profile' });
  let sut: UpdateUserUseCase;
  let userRepository: IUserRepository;
  let prisma: PrismaService;
  let storageService: IStorageService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), ImageModule, StorageModule],
      providers: [
        UpdateUserUseCase,
        UserImageService,
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
      ],
    }).compile();

    sut = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
    storageService = module.get<IStorageService>(STORAGE_SERVICE);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('수정할려고 하는 유저가 없으면', () => {
    it('예외가 발생한다', async () => {
      await expect(sut.execute({ userId: 'userId' })).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('닉네임을 수정하는 경우', () => {
    const newNickname = 'new123';
    it('닉네임을 저장하고 유저정보를 반환한다', async () => {
      await userRepository.save(user);

      const updatedUser = await sut.execute({ userId: user.getId(), nickname: newNickname });
      expect(updatedUser.getNickname()).toBe(newNickname);
    });
  });

  describe('프로필 이미지를 수정하는 경우', () => {
    const uploadedProfileUrl = 'uploadedUrl';
    it('프로필 이미지를 저장하고 유저정보를 반환한다', async () => {
      jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedProfileUrl);
      await userRepository.save(user);

      const updatedUser = await sut.execute({ userId: user.getId(), profileImage: generateMulterFile() });
      expect(updatedUser.getProfile()).toBe(uploadedProfileUrl);
    });
  });
});
