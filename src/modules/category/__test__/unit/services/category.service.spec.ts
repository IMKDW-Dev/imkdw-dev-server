import { TestBed } from '@automock/jest';
import CategoryService from '../../../services/category.service';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../repository/category-repo.interface';
import { createCategory } from '../fixtures/create-category.fixture';
import { CategoryNotFoundException } from '../../../../../common/exceptions/404';
import { CategoryHaveArticlesException } from '../../../../../common/exceptions/403';

describe('CategoryService', () => {
  let sut: CategoryService;
  let categoryRepository: ICategoryRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CategoryService).compile();
    sut = unit;
    categoryRepository = unitRef.get(CATEGORY_REPOSITORY);
  });

  describe('카테고리 생성', () => {
    it.todo('카테고리 이름이 중복된 경우 DuplicateCategoryNameException 에러가 발생한다');
    it.todo('카테고리가 생성되면 카테고리 정보를 반환한다');
  });

  describe('카테고리 목록 조회', () => {
    it('카테고리 목록을 반환한다', async () => {
      // Given
      const limit = 3;

      const categories = Array.from({ length: limit }, (_, i) => createCategory({ name: `name${i + 1}` }));
      jest.spyOn(categoryRepository, 'findAll').mockResolvedValueOnce(categories);

      // when
      const result = await sut.getCategories(limit);

      // Then
      expect(result).toHaveLength(limit);
      result.map((category, i) => expect(category.name).toBe(`name${i + 1}`));
    });
  });

  describe('카테고리 이름으로 상세정보 조회', () => {
    it('카테고리가 없는 경우 CategoryNotFoundException 에러가 발생한다', async () => {
      // Given
      const name = 'name';

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      // When, Then
      await expect(sut.getCategory(name)).rejects.toThrow(CategoryNotFoundException);
    });

    it('카테고리를 상세정보를 반환한다', async () => {
      // Given
      const name = 'name';
      const category = createCategory({ name });
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);

      // When
      const result = await sut.getCategory(name);

      // Then
      expect(result.name).toBe(name);
    });
  });

  describe('카테고리 수정', () => {
    it.todo('카테고리가 존재하지 않는 경우 CategoryNotFoundException 에러가 발생한다');
    it.todo('카테고리 이미지를 변경하면 변경된 이미지로 수정된다');
    it.todo('카테고리 이름을 변경하면 변경된 이름으로 수정된다');
    it.todo('카테고리 설명을 변경하면 변경된 설명으로 수정된다');
    it.todo('카테고리 순서를 변경하면 변경된 순서로 수정된다');
    it.todo('카테고리가 수정되면 수정된 카테고리 정보를 반환한다');
  });

  describe('카테고리 삭제', () => {
    it('카테고리가 존재하지 않는경우 CategoryNotFoundException 에러가 발생한다', async () => {
      // Given
      const categoryId = 1;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      // When, Then
      await expect(sut.deleteCategory(categoryId)).rejects.toThrow(CategoryNotFoundException);
    });

    it('카테고리에 게시글이 존재하는 경우 CategoryHaveArticlesException 에러가 발생한다', async () => {
      // Given
      const categoryId = 1;
      const category = createCategory({ articleCount: 1 });

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);

      // When, Then
      await expect(sut.deleteCategory(categoryId)).rejects.toThrow(CategoryHaveArticlesException);
    });

    it('카테고리가 삭제된다', async () => {
      // Given
      const categoryId = 1;
      const category = createCategory({ articleCount: 0 });

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);

      // When
      await sut.deleteCategory(categoryId);

      // Then
      expect(categoryRepository.delete).toHaveBeenCalledWith(category);
    });
  });
});
