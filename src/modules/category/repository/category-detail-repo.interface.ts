import CategoryDetailDto from '../dto/category-detail.dto';
import { CategoryQueryFilter } from './category-query.filter';

export const CATEGORY_DETAIL_REPOSITORY = Symbol('CATEGORY_DETAIL_REPOSITORY');
export interface ICategoryDetailRepository {
  findOne(filter: CategoryQueryFilter): Promise<CategoryDetailDto>;
}
