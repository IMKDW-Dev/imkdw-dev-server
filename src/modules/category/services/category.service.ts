import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import Category, { CategoryBuilder } from '../domain/entities/category.entity';
import { DuplicateCategoryNameException } from '../../../common/exceptions/409';

@Injectable()
export default class CategoryService {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository) {}

  async createCategory(name: string): Promise<Category> {
    const categoryByName = await this.categoryRepository.findOne({ name });
    if (categoryByName) {
      throw new DuplicateCategoryNameException(name);
    }

    const nextSort = await this.categoryRepository.findNextSort();
    const newCategory = new CategoryBuilder().setName(name).setSort(nextSort).build();
    return this.categoryRepository.save(newCategory);
  }
}
