import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import { DuplicateCategoryNameException } from '../../../common/exceptions/409';
import { CreateCategoryDto } from '../dto/internal/create-category.dto';
import CategoryImageService from './category-image.service';
import { CategoryNotFoundException } from '../../../common/exceptions/404';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import CategoryDto from '../dto/category.dto';
import { CategoryHaveArticlesException } from '../../../common/exceptions/403';
import * as CategoryMapper from '../mappers/category.mapper';
import { TX } from '../../../@types/prisma/prisma.type';
import Category from '../domain/models/category.model';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '../../../infra/database/prisma';
import { CategoryQueryFilter } from '../repository/category-query.filter';

@Injectable()
export default class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    private readonly categoryImageService: CategoryImageService,
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
    const categoryByName = await this.categoryRepository.findOne({ name: dto.name });
    if (categoryByName) {
      throw new DuplicateCategoryNameException(dto.name);
    }

    // TODO: 트랜잭션 내부에 이미지 업로드? 개선필요
    const nextSort = await this.categoryRepository.findNextSort();
    const createdCategory = await this.prisma.client.$transaction(async (tx) => {
      const category = await this.categoryRepository.save(
        new Category.builder().setName(dto.name).setDesc(dto.desc).setSort(nextSort).build(),
      );
      const thumbnail = await this.categoryImageService.getThumbnail(category, dto.image);
      category.changeImage(thumbnail);
      return this.categoryRepository.update(category);
    });

    return CategoryMapper.toDto(createdCategory);
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

  async updateCategory(categoryId: number, dto: UpdateCategoryDto, file: Express.Multer.File): Promise<CategoryDto> {
    const category = await this.checkCategoryAndReturn(categoryId);

    const updateData = { ...dto };

    if (file) {
      const thumbnail = await this.categoryImageService.getThumbnail(category, file);
      updateData.image = thumbnail;
    }

    if (dto?.sort) {
      const updatedSortCategory = await this.categoryRepository.updateSort(categoryId, dto.sort);
      category.changeSort(updatedSortCategory.getSort());
    }

    const updatedCategory = await this.categoryRepository.update(category);
    return CategoryMapper.toDto(updatedCategory);
  }

  async deleteCategory(categoryId: number) {
    const category = await this.checkCategoryAndReturn(categoryId);

    if (category.isHaveArticles()) {
      throw new CategoryHaveArticlesException();
    }

    await this.categoryRepository.delete(category);
  }

  async addArticleCount(category: Category, tx: TX) {
    category.addArticleCount();
    await this.categoryRepository.update(category, tx);
  }

  async checkCategoryAndReturn(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ id: categoryId });
    if (!category) {
      throw new CategoryNotFoundException();
    }

    return category;
  }

  async findOne(filter: CategoryQueryFilter): Promise<Category> {
    return this.categoryRepository.findOne(filter);
  }

  async findNames(filter: CategoryQueryFilter): Promise<string[]> {
    return this.categoryRepository.findNames(filter);
  }
}
