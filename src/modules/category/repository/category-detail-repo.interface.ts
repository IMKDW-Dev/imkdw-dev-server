import { QueryOption } from '../../../common/interfaces/common-query.filter';
import CategoryDetailDto from '../dto/category-detail.dto';
import { CategoryQueryFilter } from './category-query.filter';

export const CATEGORY_DETAIL_REPOSITORY = Symbol('CATEGORY_DETAIL_REPOSITORY');
export interface ICategoryDetailRepository {
  findOne(filter: CategoryQueryFilter): Promise<CategoryDetailDto>;
  findMany(filter: CategoryQueryFilter, option?: QueryOption): Promise<CategoryDetailDto[]>;
}
