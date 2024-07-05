import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import { CreateCategoryDto } from '../../../dto/internal/create-category.dto';
import { UpdateCategoryDto } from '../../../dto/internal/update-category.dto';

// eslint-disable-next-line import/prefer-default-export
export const createUpdateCategoryDto = (params: Partial<UpdateCategoryDto>): CreateCategoryDto => {
  return {
    name: params?.name ?? 'name',
    desc: params?.desc ?? 'category description',
    image: generateMulterFile(),
  };
};
