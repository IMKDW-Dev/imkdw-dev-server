import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import Category from '../domain/models/category.model';
import { CategoryNotFoundException } from '../../../../common/exceptions/404';

@Injectable()
export default class CategoryValidatorService {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository) {}

  async findOneOrThrow(filter: CategoryQueryFilter): Promise<Category> {
    const category = await this.categoryRepository.findOne(filter);
    if (!category) {
      throw new CategoryNotFoundException(`카테고리 이름 ${filter.name}을 찾을 수 없습니다.`);
    }

    return category;
  }
}
