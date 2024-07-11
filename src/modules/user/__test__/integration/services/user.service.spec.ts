import { Test } from '@nestjs/testing';
import PrismaService from '../../../../../infra/database/prisma.service';
import { USER_REPOSITORY } from '../../../interfaces/user-repo.interface';
import UserService from '../../../services/user.service';
import createClsModule from '../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../common/modules/config.module';
import UserRepository from '../../../infra/user.repository';
import CreateUserUseCase from '../../../use-cases/create-user.use-case';
import UpdateUserUseCase from '../../../use-cases/update-user.use-case';
import GetUserInfoUseCase from '../../../use-cases/get-user-info.use-case';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import StorageModule from '../../../../../infra/storage/storage.module';
import ImageModule from '../../../../../infra/image/image.module';
import UserImageService from '../../../services/user-image.service';

describe('UserService', () => {
  let sut: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), StorageModule, ImageModule],
      providers: [
        UserService,
        CreateUserUseCase,
        UpdateUserUseCase,
        GetUserInfoUseCase,
        UserImageService,
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
      ],
    }).compile();

    sut = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  it('defined', () => {
    expect(sut).toBeDefined();
  });
});
