import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import { DuplicateCategoryNameException } from '../../../common/exceptions/409';
import { CreateCategoryDto } from '../dto/internal/create-category.dto';
import CategoryImageService from './category-image.service';
import { CategoryNotFoundException } from '../../../common/exceptions/404';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import CategoryDto from '../dto/category.dto';
import { CategoryHaveArticlesException } from '../../../common/exceptions/403';
import * as CategoryMapper from '../mappers/category.mapper';
import Category from '../domain/models/category.model';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import PrismaService from '../../../infra/database/prisma.service';

@Injectable()
export default class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    private readonly categoryImageService: CategoryImageService,
    private readonly prisma: PrismaService,
  ) {}

  @Transactional()
  async createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
    const categoryByName = await this.categoryRepository.findOne({ name: dto.name });
    if (categoryByName) {
      throw new DuplicateCategoryNameException(dto.name);
    }

    const nextSort = await this.categoryRepository.findNextSort();
    const category = await this.categoryRepository.save(
      new Category.builder().setName(dto.name).setDesc(dto.desc).setSort(nextSort).build(),
    );
    const image = await this.categoryImageService.getImage(category, dto.image);
    category.changeImage(image);
    const updatedCategory = await this.categoryRepository.update(category);

    return CategoryMapper.toDto(updatedCategory);
  }

  async getCategories(limit: number): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findAll({ limit });
    return categories.map(CategoryMapper.toDto);
  }

  async getCategory(name: string): Promise<CategoryDto> {
    const categoryDetail = await this.categoryRepository.findOne({ name });
    if (!categoryDetail) {
      throw new CategoryNotFoundException({ name });
    }

    return CategoryMapper.toDto(categoryDetail);
  }

  @Transactional()
  async updateCategory(categoryId: number, dto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.findOneOrThrow({ id: categoryId });
    category.changeName(dto.name);
    category.changeDesc(dto.desc);

    if (dto?.image) {
      const image = await this.categoryImageService.getImage(category, dto.image);
      category.changeImage(image);
    }

    if (dto.sort !== category.getSort()) {
      const updatedSortCategory = await this.categoryRepository.updateSort(categoryId, dto.sort);
      category.changeSort(updatedSortCategory.getSort());
    }

    const updatedCategory = await this.categoryRepository.update(category);
    return CategoryMapper.toDto(updatedCategory);
  }

  async deleteCategory(categoryId: number) {
    const category = await this.findOneOrThrow({ id: categoryId });

    if (category.isHaveArticles()) {
      throw new CategoryHaveArticlesException();
    }

    await this.categoryRepository.delete(category);
  }

  async addArticleCount(category: Category) {
    category.addArticleCount();
    await this.categoryRepository.update(category);
  }

  async findOneOrThrow(filter: CategoryQueryFilter): Promise<Category> {
    const category = await this.categoryRepository.findOne(filter);
    if (!category) {
      throw new CategoryNotFoundException(`${filter} not found`);
    }

    return category;
  }

  async findNames(filter: CategoryQueryFilter): Promise<string[]> {
    return this.categoryRepository.findNames(filter);
  }
}
