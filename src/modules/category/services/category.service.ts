import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import { CreateCategoryDto } from '../dto/internal/create-category.dto';
import { CategoryNotFoundException } from '../../../common/exceptions/404';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import CategoryDto from '../dto/category.dto';
import * as CategoryMapper from '../mappers/category.mapper';
import Category from '../domain/models/category.model';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import CreateCategoryUseCase from '../use-cases/create-category.use-case';
import UpdateCategoryUseCase from '../use-cases/update-category.use-case';
import DeleteCategoryUseCase from '../use-cases/delete-category.use-case';

@Injectable()
export default class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Transactional()
  async createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
    const category = await this.createCategoryUseCase.execute(dto);
    return CategoryMapper.toDto(category);
  }

  async getCategories(limit: number): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findAll({ limit });
    return categories.map(CategoryMapper.toDto);
  }

  async getCategory(name: string): Promise<CategoryDto> {
    const category = await this.findOneOrThrow({ name });
    if (!category) {
      throw new CategoryNotFoundException(`카테고리 이름 ${name}을 찾을 수 없습니다.`);
    }

    return CategoryMapper.toDto(category);
  }

  @Transactional()
  async updateCategory(dto: UpdateCategoryDto): Promise<CategoryDto> {
    const updatedCategory = await this.updateCategoryUseCase.execute(dto);
    return CategoryMapper.toDto(updatedCategory);
  }

  async deleteCategory(categoryId: number) {
    return this.deleteCategoryUseCase.execute(categoryId);
  }

  async addArticleCount(category: Category) {
    category.addArticleCount();
    await this.categoryRepository.update(category);
  }

  async findNames(filter?: CategoryQueryFilter): Promise<string[]> {
    return this.categoryRepository.findNames(filter);
  }

  async findOneOrThrow(filter: CategoryQueryFilter): Promise<Category> {
    const category = await this.categoryRepository.findOne(filter);
    if (!category) {
      throw new CategoryNotFoundException(`${JSON.stringify(filter)}을 찾을 수 없습니다.`);
    }

    return category;
  }
}
