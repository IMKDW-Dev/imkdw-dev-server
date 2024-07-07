import { Test } from '@nestjs/testing';
import createClsModule from '../../../../../common/modules/cls.module';
import { UserNotFoundException } from '../../../../../common/exceptions/404';
import { createUser } from '../../fixtures/create-user.fixture';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../infra/database/prisma.service';
import { IUserRepository, USER_REPOSITORY } from '../../../interfaces/user-repo.interface';
import UserRepository from '../../../infra/user.repository';
import createConfigModule from '../../../../../common/modules/config.module';
import GetUserInfoUseCase from '../../../use-cases/get-user-info.use-case';

describe('GetUserInfoUseCase', () => {
  const user = createUser({ email: 'email', nickname: 'nickname', profile: 'profile' });
  let sut: GetUserInfoUseCase;
  let userRepository: IUserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule()],
      providers: [
        GetUserInfoUseCase,
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
      ],
    }).compile();

    sut = module.get<GetUserInfoUseCase>(GetUserInfoUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('유저가 없으면', () => {
    it('예외가 발생한다', async () => {
      await expect(sut.execute({ userId: 'userId' })).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('유저정보를 반환하는 경우', () => {
    it('유저정보를 반환한다', async () => {
      await userRepository.save(user);

      const userInfo = await sut.execute({ userId: user.getId() });

      expect(userInfo.getEmail()).toBe(user.getEmail());
      expect(userInfo.getNickname()).toBe(user.getNickname());
      expect(userInfo.getProfile()).toBe(user.getProfile());
    });
  });
});
