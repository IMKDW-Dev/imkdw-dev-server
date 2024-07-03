import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import Category from '../../../domain/models/category.model';
import { CreateCategoryDto } from '../../../dto/internal/create-category.dto';

export const createCreateCategoryDto = (params: Partial<CreateCategoryDto>): CreateCategoryDto => {
  return {
    name: params?.name ?? 'name',
    desc: params?.desc ?? 'category description',
    image: generateMulterFile(),
  };
};

interface CreateCategoryParams {
  name?: string;
  desc?: string;
  articleCount?: number;
}
export const createCategory = (params: CreateCategoryParams): Category => {
  return new Category.builder()
    .setName(params?.name ?? 'name')
    .setDesc(params?.desc ?? 'category description')
    .setArticleCount(params?.articleCount ?? 0)
    .build();
};
