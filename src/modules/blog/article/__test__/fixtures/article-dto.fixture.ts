import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import { CreateArticleDto } from '../../dto/internal/create-article.dto';

// eslint-disable-next-line import/prefer-default-export
export const createCreateArticleDto = (params?: Partial<CreateArticleDto>): CreateArticleDto => {
  return {
    title: params?.title ?? 'a'.repeat(10),
    visible: params?.visible ?? true,
    id: params?.id ?? 'a'.repeat(24),
    categoryId: params?.categoryId ?? 1,
    content: params?.content ?? 'a'.repeat(100),
    thumbnail: params?.thumbnail ?? generateMulterFile(),
    tags: params?.tags ?? ['tag1'],
    images: params?.images ?? [],
  };
};
