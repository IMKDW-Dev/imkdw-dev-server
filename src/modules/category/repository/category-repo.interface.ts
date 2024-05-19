import { InjectionToken } from '@nestjs/common';
import { CategoryQueryFilter } from './category-query.filter';
import Category from '../domain/entities/category.entity';

export const CATEGORY_REPOSITORY: InjectionToken = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  findOne(filter: CategoryQueryFilter): Promise<Category | null>;
  findNextSort(): Promise<number>;
  save(category: Category): Promise<Category>;
}
