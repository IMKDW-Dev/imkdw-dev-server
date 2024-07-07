import { Test } from '@nestjs/testing';
import CreateTagUseCase from '../../../use-cases/create-tag.use-case';
import createClsModule from '../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../common/modules/config.module';
import { TAG_REPOSITORY } from '../../../repository/tag-repo.interface';
import TagRepository from '../../../infra/tag.repository';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../infra/database/prisma.service';

describe('CreateTagUseCase', () => {
  let sut: CreateTagUseCase;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule()],
      providers: [
        CreateTagUseCase,
        {
          provide: TAG_REPOSITORY,
          useClass: TagRepository,
        },
      ],
    }).compile();

    sut = module.get<CreateTagUseCase>(CreateTagUseCase);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('태그를 생성하고', () => {
    const tagNames = ['tag1', 'tag2'];
    it('태그 목록을 반환한다', async () => {
      const result = await sut.execute({ tagNames });
      expect(result[0].toString()).toBe(tagNames[0]);
      expect(result[1].toString()).toBe(tagNames[1]);
    });
  });
});
