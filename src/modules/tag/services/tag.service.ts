import { Inject, Injectable } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '../repository/tag-repo.interface';
import { TX } from '../../../@types/prisma/prisma.type';
import Tag from '../domain/models/tag.model';

@Injectable()
export default class TagService {
  constructor(@Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository) {}

  async createMany(tagNames: string[], tx: TX): Promise<Tag[]> {
    const tags = tagNames.map((name) => new Tag.builder().setName(name).build());
    return this.tagRepository.createMany(tags, tx);
  }

  async findManyByNames(names: string[]) {
    return this.tagRepository.findManyByNames(names);
  }
}
