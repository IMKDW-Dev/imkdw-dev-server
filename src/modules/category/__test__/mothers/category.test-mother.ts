import { faker } from '@faker-js/faker';

import Category from '../../domain/entities/category.entity';

// eslint-disable-next-line import/prefer-default-export
export const generateCategory = (params?: Partial<Category>): Category =>
  Category.create({
    articleCount: 0,
    desc: faker.lorem.sentence(),
    image: faker.image.url(),
    name: faker.lorem.word(),
    sort: 1,
    ...params,
  });
