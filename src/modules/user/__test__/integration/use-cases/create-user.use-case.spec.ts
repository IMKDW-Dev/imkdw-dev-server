import { Test } from '@nestjs/testing';
import { createUser } from '../../fixtures/create-user.fixture';
import UserOAuthProvider from '../../../domain/models/user-oauth-provider.model';
import { DuplicateEmailException } from '../../../../../common/exceptions/409';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import UserRepository from '../../../infra/user.repository';
import CreateUserUseCase from '../../../use-cases/create-user.use-case';
import { IUserRepository, USER_REPOSITORY } from '../../../interfaces/user-repo.interface';
import PrismaService from '../../../../../infra/database/prisma.service';
import createClsModule from '../../../../../common/modules/cls.module';

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase;
  let userRepository: IUserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = moduleRef.get<IUserRepository>(USER_REPOSITORY);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('이미 존재하는 이메일로', () => {
    const email = 'email';
    describe('유저 생성을 시도하면', () => {
      it('예외가 발생한다', async () => {
        const user = createUser({ email });
        await userRepository.save(user);

        await expect(() => sut.execute({ email, oAuthProvider: UserOAuthProvider.GOOGLE })).rejects.toThrow(
          DuplicateEmailException,
        );
      });
    });
  });

  describe('존재하지 않는 이메일로', () => {
    const email = 'email';
    describe('유저 생성을 시도하면', () => {
      it('생성된 유저를 반환한다', async () => {
        const user = await sut.execute({ email, oAuthProvider: UserOAuthProvider.GOOGLE });
        expect(user.getEmail()).toBe(email);
      });
    });
  });
});
