import { Test } from '@nestjs/testing';
import CreateCategoryUseCase from '../../../use-cases/create-category.use-case';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../repository/category-repo.interface';
import CategoryRepository from '../../../infra/category.repository';
import CategoryImageService from '../../../services/category-image.service';
import { createCategory } from '../../fixtures/create-category.fixture';
import { CreateCategoryDto } from '../../../dto/internal/create-category.dto';
import PrismaService from '../../../../../../infra/database/prisma.service';
import { IStorageService, STORAGE_SERVICE } from '../../../../../../infra/storage/interfaces/storage.interface';
import createClsModule from '../../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import ImageModule from '../../../../../../infra/image/image.module';
import StorageModule from '../../../../../../infra/storage/storage.module';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import { generateMulterFile } from '../../../../../../__test__/fixtures/create-multer-file.fixture';
import { DuplicateCategoryNameException } from '../../../../../../common/exceptions/409';

describe('CreateCategoryUseCase', () => {
  let sut: CreateCategoryUseCase;
  let categoryRepository: ICategoryRepository;
  let prisma: PrismaService;
  let storageService: IStorageService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), ImageModule, StorageModule],
      providers: [
        CreateCategoryUseCase,
        CategoryImageService,
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
      ],
    }).compile();

    sut = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
    storageService = module.get<IStorageService>(STORAGE_SERVICE);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('중복된 이름을 가진 카테고리가 있다면', () => {
    const [name, desc, imageUrl] = ['name', 'description', 'imageUrl'];
    const dto: CreateCategoryDto = { name, desc, image: generateMulterFile() };
    const category = createCategory({ name, desc, image: imageUrl });
    it('예외가 발생한다', async () => {
      await categoryRepository.save(category);
      await expect(sut.execute(dto)).rejects.toThrow(DuplicateCategoryNameException);
    });
  });

  describe('중복되지 않은 이름으로', () => {
    const [name, desc, imageUrl] = ['name', 'description', 'imageUrl'];
    const dto: CreateCategoryDto = { name, desc, image: generateMulterFile() };
    describe('카테고리를 생성하면', () => {
      it('카테고리 정보를 반환한다', async () => {
        jest.spyOn(storageService, 'upload').mockResolvedValue(imageUrl);

        const result = await sut.execute(dto);
        expect(result.getName()).toBe(name);
        expect(result.getDesc()).toBe(desc);
        expect(result.getImage()).toBe(imageUrl);
      });
    });
  });
});
