export interface QueryOption<T = never> {
  /**
   * 조회할 데이터의 개수
   */
  limit?: number;

  /**
   * 순서 조정
   */
  orderBy?: {
    [key in keyof Partial<T>]: 'asc' | 'desc';
  };
}
