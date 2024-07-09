import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import Category from '../domain/models/category.model';

@Injectable()
export default class CategoryCounterService {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository) {}

  async addArticleCount(category: Category) {
    category.addArticleCount();
    await this.categoryRepository.update(category);
  }
}
