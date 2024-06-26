import { InjectionToken } from '@nestjs/common';
import { CategoryQueryFilter } from './category-query.filter';
import { TX } from '../../../@types/prisma/prisma.type';
import Category from '../domain/models/category.model';
import { CategoryQueryOption } from './category-query.option';

export const CATEGORY_REPOSITORY: InjectionToken = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  findOne(filter: CategoryQueryFilter): Promise<Category | null>;
  findMany(filter: CategoryQueryFilter, option?: CategoryQueryOption): Promise<Category[]>;
  findAll(option: CategoryQueryOption): Promise<Category[]>;
  findNextSort(): Promise<number>;

  findNames(filter: CategoryQueryFilter): Promise<string[]>;

  save(category: Category, tx?: TX): Promise<Category>;

  update(category: Category, tx?: TX): Promise<Category>;
  updateSort(id: number, newSort: number): Promise<Category>;

  delete(category: Category): Promise<void>;
}
