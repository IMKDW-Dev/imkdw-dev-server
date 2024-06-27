import Tag from '../../../../tag/domain/models/tag.model';
import { getNewTags } from '../../../functions/separate-tag.function';

describe('getNewTags', () => {
  it('새로운 태그이름들을 반환한다', () => {
    // Given
    const existTags = Array.from({ length: 5 }, (_, i) => new Tag.builder().setName(`태그${i + 1}`).build());
    const newTagNames = ['태그2', '태그4', '태그5'];

    // When
    const sut = getNewTags(existTags, newTagNames);

    // Then
    expect(sut).toEqual(['태그1', '태그3']);
  });
});
