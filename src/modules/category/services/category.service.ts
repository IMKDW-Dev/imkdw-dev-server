import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import Category, { CategoryBuilder } from '../domain/entities/category.entity';
import { DuplicateCategoryNameException } from '../../../common/exceptions/409';
import { CreateCategoryDto } from '../dto/internal/create-category.dto';
import CategoryImageService from './category-image.service';
import { CategoryNotFoundException } from '../../../common/exceptions/404';
import CategoryDto from '../dto/category.dto';

@Injectable()
export default class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    private readonly categoryImageService: CategoryImageService,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const categoryByName = await this.categoryRepository.findOne({ name: dto.name });

    if (categoryByName) {
      throw new DuplicateCategoryNameException(dto.name);
    }

    const nextSort = await this.categoryRepository.findNextSort();
    const newCategory = new CategoryBuilder()
      .setName(dto.name)
      .setSort(nextSort)
      .setImage('')
      .setDesc(dto.desc)
      .build();

    const category = await this.categoryRepository.save(newCategory);
    const thumbnail = await this.categoryImageService.getThumbnail(category, dto.image);
    await this.categoryRepository.update(category.getId(), { image: thumbnail });

    return category;
  }

  async getCategories(limit: number): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findMany({ limit });
    return categories.map((category) => category.toDto());
  }

  async getCategoryDetail(name: string): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ name });
    if (!category) {
      throw new CategoryNotFoundException({ name });
    }

    return category.toDto();
  }
}
