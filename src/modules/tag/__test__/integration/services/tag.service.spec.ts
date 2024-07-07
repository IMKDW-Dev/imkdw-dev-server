import { Test } from '@nestjs/testing';
import TagService from '../../../services/tag.service';
import createClsModule from '../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../common/modules/config.module';
import CreateTagUseCase from '../../../use-cases/create-tag.use-case';
import { TAG_REPOSITORY } from '../../../repository/tag-repo.interface';
import TagRepository from '../../../infra/tag.repository';

describe('TagService', () => {
  let sut: TagService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule()],
      providers: [
        TagService,
        CreateTagUseCase,
        {
          provide: TAG_REPOSITORY,
          useClass: TagRepository,
        },
      ],
    }).compile();

    sut = module.get<TagService>(TagService);
  });

  it('defined', () => {
    expect(sut).toBeDefined();
  });
});
