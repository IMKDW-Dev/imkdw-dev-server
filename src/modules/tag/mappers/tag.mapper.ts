import Tag from '../domain/models/tag.model';
import TagDto from '../dto/tag.dto';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (tag: Tag) => new TagDto(tag.getId(), tag.getName());
