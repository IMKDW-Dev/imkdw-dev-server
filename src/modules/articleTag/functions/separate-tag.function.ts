import Tag from '../../tag/domain/entities/tag.entity';

/**
 * 기존에 존재하는 태그를 반환하는 함수
 * @param existTags - DB에 저장된 기존에 존재하는 태그
 * @param newTags - 게시글 작성시 입력한 태그
 */
export const getExistTags = (existTags: Tag[], newTags: string[]) => {
  const existTagNames = existTags.map((tag) => tag.name);
  return existTags.filter((tag) => newTags.includes(tag.name));
};

export const functionName = () => {};
