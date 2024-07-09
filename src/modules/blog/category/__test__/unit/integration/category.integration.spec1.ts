import { createCategory, createCreateCategoryDto } from '../../fixtures/create-category.fixture';
import CategoryService from '../../../services/category.service';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../repository/category-repo.interface';
import { DuplicateCategoryNameException } from '../../../../../common/exceptions/409';
import IntegrationTestModule from '../../../../../__test__/modules/integration-test.module';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../infra/database/prisma.service';
import { IStorageService, STORAGE_SERVICE } from '../../../../../infra/storage/interfaces/storage.interface';
import { createCategoryDto } from '../../fixtures/category.fixture';
import { CategoryNotFoundException } from '../../../../../common/exceptions/404';
import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import { CategoryHaveArticlesException } from '../../../../../common/exceptions/403';

describe('CategoryIntegration', () => {
  let categoryService: CategoryService;
  let categoryRepository: ICategoryRepository;
  let storageService: IStorageService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await IntegrationTestModule.create();

    categoryService = moduleRef.get<CategoryService>(CategoryService);
    categoryRepository = moduleRef.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    storageService = moduleRef.get<IStorageService>(STORAGE_SERVICE);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('카테고리 생성', () => {
    it('카테고리 이름이 중복된 경우 DuplicateCategoryNameException 에러가 발생한다', async () => {
      // Given
      const categoryName = 'name';
      const category = createCategory({ name: categoryName });
      await categoryRepository.save(category);

      const dto = createCreateCategoryDto({ name: categoryName });

      // When, Then
      await expect(categoryService.createCategory(dto)).rejects.toThrow(DuplicateCategoryNameException);
    });

    it('카테고리가 정상적으로 만들어진 경우 생성된 카테고리의 정보를 반환한다', async () => {
      // Given
      const [name, desc, imageUrl] = ['name', 'description', 'https://image.com'];
      const dto = createCreateCategoryDto({ name, desc });

      const uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(imageUrl);

      // When
      const result = await categoryService.createCategory(dto);

      // Then
      expect(result).toEqual(
        createCategoryDto({
          id: 1,
          name,
          desc,
          image: imageUrl,
          sort: 1,
          articleCount: 0,
        }),
      );

      /**
       * 원본 이미지와 썸네일 이미지를 모두 업로드하므로 2번 호출하게 된다.
       */
      expect(uploadSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('카테고리 목록 조회', () => {
    it('카테고리가 없을경우 빈 배열을 반환한다', async () => {
      // Given
      const limit = 3;

      // When
      const result = await categoryService.getCategories(limit);

      // Then
      expect(result).toEqual([]);
    });

    it('카테고리 목록을 반환한다', async () => {
      // Given
      const limit = 3;
      const categories = Array.from({ length: limit }, (_, i) => {
        return createCategory({
          id: i + 1,
          name: `name${i + 1}`,
          desc: `description${i + 1}`,
          image: `image${i + 1}`,
          sort: i + 1,
        });
      });
      await categoryRepository.saveMany(categories);

      // When
      const result = await categoryService.getCategories(limit);

      // Then
      expect(result).toHaveLength(limit);
      expect(result).toEqual(
        categories.map((category) =>
          createCategoryDto({
            id: category.getId(),
            name: category.getName(),
            desc: category.getDesc(),
            image: category.getImage(),
            sort: category.getSort(),
            articleCount: category.getArticleCount(),
          }),
        ),
      );
    });
  });

  describe('카테고리 수정', () => {
    it('카테고리가 존재하지 않는경우 CategoryNotFoundException 에러가 발생한다', async () => {
      // Given
      const categoryId = 1;

      // When, Then
      await expect(
        categoryService.updateCategory(categoryId, {
          desc: 'newDescription',
          name: 'newName',
          sort: 2,
        }),
      ).rejects.toThrow(CategoryNotFoundException);
    });

    describe('이미지를 변경하는 경우', () => {
      it('스토리지에 이미지를 업로드하고 카테고리 이미지를 변경한다', async () => {
        // Given
        const category = createCategory({ name: 'name' });
        await categoryRepository.save(category);

        const imageUrl = 'https://image.com';

        const uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(imageUrl);

        // When
        const result = await categoryService.updateCategory(category.getId(), {
          desc: category.getDesc(),
          name: category.getName(),
          sort: category.getSort(),
          image: generateMulterFile(),
        });

        // Then
        expect(result).toEqual(
          createCategoryDto({
            id: category.getId(),
            name: category.getName(),
            desc: category.getDesc(),
            image: imageUrl,
            sort: category.getSort(),
            articleCount: category.getArticleCount(),
          }),
        );

        /**
         * 원본 이미지와 썸네일 이미지를 모두 업로드하므로 2번 호출하게 된다.
         */
        expect(uploadSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe('카테고리 순서를 변경하는 경우', () => {
      it('대상 카테고리의 순서가 변경되고, 나머지 카테고리의 순서도 변경된다', async () => {
        // Given
        const categories = Array.from({ length: 3 }, (_, i) => {
          return createCategory({
            id: i + 1,
            name: `name${i + 1}`,
            desc: `description${i + 1}`,
            image: `image`,
            sort: i + 1,
          });
        });
        await categoryRepository.saveMany(categories);
        const targetCategory = categories.find((category) => category.getSort() === 1);
        const destinationCategory = categories.find((category) => category.getSort() === 2);

        // When
        const result = await categoryService.updateCategory(targetCategory.getId(), {
          desc: targetCategory.getDesc(),
          name: targetCategory.getName(),
          sort: 2,
        });

        // Then
        expect(result.sort).toBe(2);

        const updatedCategories = await categoryRepository.findOne({ id: destinationCategory.getId() });
        expect(updatedCategories.getSort()).toBe(1);
      });
    });

    it('카테고리 수정 성공시 카테고리 정보를 반환한다', async () => {
      // Given
      const updateName = 'updateName';
      const updateDesc = 'updateDescription';
      const category = createCategory();
      await categoryRepository.save(category);

      // When
      const result = await categoryService.updateCategory(category.getId(), {
        desc: updateDesc,
        name: updateName,
        sort: category.getSort(),
      });

      // Then
      expect(result).toEqual(
        createCategoryDto({
          id: category.getId(),
          name: updateName,
          desc: updateDesc,
          image: category.getImage(),
          sort: category.getSort(),
          articleCount: category.getArticleCount(),
        }),
      );
    });
  });

  describe('카테고리 삭제', () => {
    it('카테고리가 존재하지 않는경우 CategoryNotFoundException 에러가 발생한다', async () => {
      // Given
      const categoryId = 1;

      // When, Then
      await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow(CategoryNotFoundException);
    });

    it('카테고리에 게시글이 존재하는 경우 CategoryHaveArticlesException 에러가 발생한다', async () => {
      // Given
      const category = createCategory({ articleCount: 1 });
      await categoryRepository.save(category);

      // When, Then
      await expect(categoryService.deleteCategory(category.getId())).rejects.toThrow(CategoryHaveArticlesException);
    });

    it('카테고리가 삭제된다', async () => {
      // Given
      const category = createCategory();
      await categoryRepository.save(category);

      // When
      await categoryService.deleteCategory(category.getId());

      // Then
      await expect(categoryService.findOneOrThrow({ id: category.getId() })).rejects.toThrow(CategoryNotFoundException);
    });
  });

  describe('카테고리 이름 목록 조회', () => {
    it('카테고리 이름 목록을 반환한다', async () => {
      // Given
      const categories = Array.from({ length: 5 }, (_, i) => {
        return createCategory({
          id: i + 1,
          name: `name${i + 1}`,
          desc: `description${i + 1}`,
          image: `image${i + 1}`,
          sort: i + 1,
        });
      });
      await categoryRepository.saveMany(categories);

      // When
      const result = await categoryService.findNames();

      // Then
      expect(result).toHaveLength(categories.length);
      expect(result).toEqual(categories.map((category) => category.getName()));
    });
  });
});
