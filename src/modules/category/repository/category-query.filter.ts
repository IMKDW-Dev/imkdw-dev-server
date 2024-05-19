import { CommonQueryFilter } from '../../../common/interfaces/common-query.filter';

export interface CategoryQueryFilter extends CommonQueryFilter {
  id?: number;
  name?: string;
}
