import CategoryDto from '../../../dto/category.dto';

// eslint-disable-next-line import/prefer-default-export
export const createCategoryDto = (params: Partial<CategoryDto>): CategoryDto => {
  return {
    id: params?.id ?? 1,
    desc: params?.desc ?? 'description',
    image: params?.image ?? 'image',
    name: params?.name ?? 'name',
    sort: params?.sort ?? 1,
    articleCount: params?.articleCount ?? 0,
  };
};
