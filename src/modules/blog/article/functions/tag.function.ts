import Tag from '../../tag/domain/models/tag.model';

// eslint-disable-next-line import/prefer-default-export
export const getNewTags = (existTags: Tag[], newTagNames: string[]): string[] => {
  const existTagNames = existTags.map((tag) => tag.toString());
  return newTagNames.filter((newTagName) => !existTagNames.includes(newTagName));
};
