import { QueryOption } from '../../../../common/interfaces/common-query.filter';

type QueryKey = 'createdAt' | 'viewCount';
export type ArticleQueryOption = QueryOption<QueryKey>;
