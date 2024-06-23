import { faker } from '@faker-js/faker';
import { CreateArticleDto } from '../../dto/internal/article/create-article.dto';
import { generateMulterFile } from '../../../../__test__/mothers/common.test-mother';

// eslint-disable-next-line import/prefer-default-export
export const generateCreateArticleDto = (params?: Partial<CreateArticleDto>): CreateArticleDto => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraph(),
  categoryId: 1,
  tags: [faker.lorem.word()],
  thumbnail: generateMulterFile(),
  visible: true,
  images: [],
  ...params,
});
