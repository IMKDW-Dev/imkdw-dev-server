import { InjectionToken } from '@nestjs/common';
import { CategoryQueryFilter } from './category-query.filter';
import Category from '../domain/entities/category.entity';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import { QueryOption } from '../../../common/interfaces/common-query.filter';

export const CATEGORY_REPOSITORY: InjectionToken = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  findOne(filter: CategoryQueryFilter): Promise<Category | null>;
  findMany(filter: CategoryQueryFilter, option?: QueryOption): Promise<Category[]>;
  findNextSort(): Promise<number>;

  save(category: Category): Promise<Category>;

  update(category: Category, data: UpdateCategoryDto): Promise<Category>;
  updateSort(id: number, newSort: number): Promise<void>;

  delete(category: Category): Promise<void>;
}
