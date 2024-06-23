import Tag from '../../tag/domain/entities/tag.entity';

// eslint-disable-next-line import/prefer-default-export
export const getNewTags = (existTags: Tag[], newTagNames: string[]) =>
  existTags.map((tag) => tag.name).filter((name) => !newTagNames.includes(name));
