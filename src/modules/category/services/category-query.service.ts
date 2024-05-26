import { Inject, Injectable } from '@nestjs/common';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import Category from '../domain/entities/category.entity';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';

@Injectable()
export default class CategoryQueryService {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository) {}

  async findOne(filter: CategoryQueryFilter): Promise<Category> {
    return this.categoryRepository.findOne(filter);
  }
}
