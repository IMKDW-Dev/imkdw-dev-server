import Tag from '../../../../tag/domain/models/tag.model';
import { getNewTags } from '../../../functions/tag.function';

describe('getNewTags', () => {
  it('새로운 태그이름들을 반환한다', () => {
    // Given
    const existTags = Array.from({ length: 5 }, (_, i) => new Tag.builder().setName(`태그${i + 1}`).build());
    const newTagNames = ['태그2', '태그6', '태그7'];

    // When
    const result = getNewTags(existTags, newTagNames);

    // Then
    expect(result).toEqual(['태그6', '태그7']);
  });
});
