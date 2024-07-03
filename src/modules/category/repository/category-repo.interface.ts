import { CategoryQueryFilter } from './category-query.filter';
import Category from '../domain/models/category.model';
import { CategoryQueryOption } from './category-query.option';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  findOne(filter: CategoryQueryFilter): Promise<Category | null>;
  findMany(filter: CategoryQueryFilter, option?: CategoryQueryOption): Promise<Category[]>;
  findAll(option: CategoryQueryOption): Promise<Category[]>;
  findNextSort(): Promise<number>;

  findNames(filter: CategoryQueryFilter): Promise<string[]>;

  save(category: Category): Promise<Category>;

  update(category: Category): Promise<Category>;
  updateSort(category: Category, newSort: number): Promise<Category>;

  delete(category: Category): Promise<void>;
}
