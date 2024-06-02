interface Params<T> {
  items: T[];
  totalCount: number;
  limit: number;
  currentPage: number;
}

export interface OffsetPagingResult<T> {
  items: T[];
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const getOffsetPagingResult = <T>(params: Params<T>): OffsetPagingResult<T> => {
  const { currentPage, items, limit, totalCount } = params;
  const totalPage = Math.ceil(totalCount / limit);
  const hasNextPage = currentPage < totalPage;
  const hasPreviousPage = currentPage > 1;

  return {
    items,
    totalPage,
    hasNextPage,
    hasPreviousPage,
  };
};
