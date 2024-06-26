export interface QueryOption<T extends string = string> {
  /**
   * 조회할 데이터의 개수
   */
  limit?: number;

  /**
   * 순서 조정
   */
  orderBy?: {
    [key in T]?: 'asc' | 'desc';
  };

  /**
   * 조회에서 제외할 아이디
   */
  excludeId?: string | number;

  /**
   * 페이징을 위한 커서
   */
  page?: number;

  /**
   * 검색어
   */
  search?: string;
}
