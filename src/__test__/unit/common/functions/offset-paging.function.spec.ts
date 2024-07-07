import { getOffsetPagingResult } from '../../../../common/functions/offset-paging.function';

const generateItem = (length: number) => Array.from({ length }, (_, i) => `item${i + 1}`);

describe('getOffsetPagingResult', () => {
  describe('한 페이지의 데이터만 있을때', () => {
    const items = generateItem(5);
    it('이전과 다음페이지가 존재하지 않는다', () => {
      const result = getOffsetPagingResult({
        items,
        totalCount: items.length,
        limit: 5,
        currentPage: 1,
      });

      expect(result).toEqual({
        items,
        totalPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe('두번째 페이지까지의 데이터가 있을때', () => {
    const items = generateItem(10);

    describe('페이지가 1인 경우', () => {
      it('이전과 다음페이지가 존재한다', () => {
        const result = getOffsetPagingResult({
          items: items.slice(0, 5),
          totalCount: items.length,
          limit: 5,
          currentPage: 1,
        });

        expect(result).toEqual({
          items: items.slice(0, 5),
          totalPage: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        });
      });
    });

    describe('페이지가 2인 경우에', () => {
      it('이전 페이지만 존재한다', () => {
        const result = getOffsetPagingResult({
          items: items.slice(5, 10),
          totalCount: items.length,
          limit: 5,
          currentPage: 2,
        });

        expect(result).toEqual({
          items: items.slice(5, 10),
          totalPage: 2,
          hasNextPage: false,
          hasPreviousPage: true,
        });
      });
    });
  });
});
