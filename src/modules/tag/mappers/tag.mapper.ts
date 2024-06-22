import Tag from '../domain/entities/tag.entity';
import TagDto from '../dto/tag.dto';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (tag: Tag) => TagDto.create({ id: tag.id, name: tag.name });
