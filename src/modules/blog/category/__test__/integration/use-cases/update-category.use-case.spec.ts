import { Test } from '@nestjs/testing';
import UpdateCategoryUseCase from '../../../use-cases/update-category.use-case';
import CategoryRepository from '../../../infra/category.repository';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../repository/category-repo.interface';
import CategoryImageService from '../../../services/category-image.service';
import { createCategory } from '../../fixtures/create-category.fixture';
import PrismaService from '../../../../../../infra/database/prisma.service';
import { IStorageService, STORAGE_SERVICE } from '../../../../../../infra/storage/interfaces/storage.interface';
import createClsModule from '../../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import ImageModule from '../../../../../../infra/image/image.module';
import StorageModule from '../../../../../../infra/storage/storage.module';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import { CategoryNotFoundException } from '../../../../../../common/exceptions/404';
import { generateMulterFile } from '../../../../../../__test__/fixtures/create-multer-file.fixture';

describe('UpdateCategoryUseCase', () => {
  let sut: UpdateCategoryUseCase;
  let categoryRepository: ICategoryRepository;
  let prisma: PrismaService;
  let storageService: IStorageService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), ImageModule, StorageModule],
      providers: [
        UpdateCategoryUseCase,
        CategoryImageService,
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
      ],
    }).compile();

    sut = module.get<UpdateCategoryUseCase>(UpdateCategoryUseCase);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    storageService = module.get<IStorageService>(STORAGE_SERVICE);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('수정할려고 하는 카테고리가 없으면', () => {
    const [name, desc, sort] = ['name', 'description', 1];
    it('예외가 발생한다', async () => {
      await expect(sut.execute({ categoryId: 99, name, desc, sort })).rejects.toThrow(CategoryNotFoundException);
    });
  });

  describe('이미지를 수정하는 경우', () => {
    const [name, desc, sort, image] = ['name', 'description', 1, generateMulterFile()];
    const [updateName, updateDesc] = ['updateName', 'updateDescription'];
    const category = createCategory({ name, desc, sort });
    it('이미지를 저장하고 카테고리 정보를 반환한다', async () => {
      jest.spyOn(storageService, 'upload').mockResolvedValue('uploadedUrl');
      await categoryRepository.save(category);

      const updatedCategory = await sut.execute({
        categoryId: category.getId(),
        name: updateName,
        desc: updateDesc,
        sort,
        image,
      });

      expect(updatedCategory.getName()).toBe(updateName);
      expect(updatedCategory.getDesc()).toBe(updateDesc);
      expect(updatedCategory.getImage()).toBe('uploadedUrl');
    });
  });

  describe('카테고리 순서를 수정하는 경우', () => {
    const [name, desc, sort] = ['name', 'description', 1];
    const [updateName, updateDesc] = ['updateName', 'updateDescription'];
    const category = createCategory({ name, desc, sort });
    it('카테고리 순서를 저장하고 카테고리 정보를 반환한다', async () => {
      await categoryRepository.save(category);

      const updatedCategory = await sut.execute({
        categoryId: category.getId(),
        name: updateName,
        desc: updateDesc,
        sort,
      });

      expect(updatedCategory.getName()).toBe(updateName);
      expect(updatedCategory.getDesc()).toBe(updateDesc);
      expect(updatedCategory.getSort()).toBe(sort);
    });
  });
});
