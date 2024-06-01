import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import Category from '../domain/entities/category.entity';
import { DuplicateCategoryNameException } from '../../../common/exceptions/409';
import { CreateCategoryDto } from '../dto/internal/create-category.dto';
import CategoryImageService from './category-image.service';
import { CategoryNotFoundException } from '../../../common/exceptions/404';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import CategoryDto from '../dto/category.dto';
import { CategoryHaveArticlesException } from '../../../common/exceptions/403';
import * as CategoryMapper from '../mappers/category.mapper';

@Injectable()
export default class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    private readonly categoryImageService: CategoryImageService,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
    const categoryByName = await this.categoryRepository.findOne({ name: dto.name });
    if (categoryByName) {
      throw new DuplicateCategoryNameException(dto.name);
    }

    const nextSort = await this.categoryRepository.findNextSort();
    const newCategory = Category.create({ name: dto.name, sort: nextSort, desc: dto.desc });

    const category = await this.categoryRepository.save(newCategory);
    const thumbnail = await this.categoryImageService.getThumbnail(category, dto.image);
    const updatedCategory = await this.categoryRepository.update(category, { image: thumbnail });

    return CategoryMapper.toDto(updatedCategory);
  }

  async getCategories(limit: number): Promise<CategoryDto[]> {
    return this.categoryRepository.findMany({}, { limit });
  }

  async getCategory(name: string): Promise<CategoryDto> {
    const categoryDetail = await this.categoryRepository.findOne({ name });
    if (!categoryDetail) {
      throw new CategoryNotFoundException({ name });
    }

    return CategoryDto.create(categoryDetail);
  }

  async updateCategory(categoryId: number, dto: UpdateCategoryDto, file: Express.Multer.File): Promise<CategoryDto> {
    const category = await this.checkCategoryAndReturn(categoryId);

    const updateData = { ...dto };

    if (file) {
      const thumbnail = await this.categoryImageService.getThumbnail(category, file);
      updateData.image = thumbnail;
    }

    if (dto?.sort) {
      await this.categoryRepository.updateSort(categoryId, dto.sort);
    }

    const { sort, ...withoutSort } = updateData;
    const updatedCategory = await this.categoryRepository.update(category, withoutSort);
    return CategoryDto.create(updatedCategory);
  }

  async deleteCategory(categoryId: number) {
    const category = await this.checkCategoryAndReturn(categoryId);

    if (category.articleCount) {
      throw new CategoryHaveArticlesException();
    }

    await this.categoryRepository.delete(category);
  }

  async checkCategoryAndReturn(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ id: categoryId });
    if (!category) {
      throw new CategoryNotFoundException();
    }

    return category;
  }
}
