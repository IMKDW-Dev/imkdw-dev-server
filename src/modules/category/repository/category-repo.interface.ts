import { InjectionToken } from '@nestjs/common';
import { CategoryQueryFilter } from './category-query.filter';
import Category from '../domain/entities/category.entity';
import { QueryOption } from '../../../common/interfaces/common-query.filter';
import Article from '../../article/domain/entities/article.entity';
import { TX } from '../../../@types/prisma/prisma.type';

export const CATEGORY_REPOSITORY: InjectionToken = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  findOne(filter: CategoryQueryFilter): Promise<Category | null>;
  findMany(
    filter: CategoryQueryFilter,
    option?: QueryOption<Pick<Article, 'viewCount' | 'createdAt'>>,
  ): Promise<Category[]>;
  findNextSort(): Promise<number>;

  findNames(filter: CategoryQueryFilter): Promise<string[]>;

  save(category: Category): Promise<Category>;

  update(category: Category, tx: TX): Promise<Category>;
  updateSort(id: number, newSort: number): Promise<Category>;

  delete(category: Category): Promise<void>;
}
