import { faker } from '@faker-js/faker';
import Tag from '../../domain/entities/tag.entity';

interface GenerateTagParams {
  id?: number;
  name?: string;
}
// eslint-disable-next-line import/prefer-default-export
export const generateTag = (params?: GenerateTagParams) =>
  Tag.create({ id: params?.id ?? faker.number.int(), name: params?.name ?? faker.lorem.word() });
