import { TX } from '../../../@types/prisma/prisma.type';
import Tag from '../domain/models/tag.model';

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');
export interface ITagRepository {
  findManyByNames(names: string[]): Promise<Tag[]>;
  createMany(tags: Tag[], tx?: TX): Promise<Tag[]>;
}
