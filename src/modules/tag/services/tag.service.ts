import { Inject, Injectable } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '../repository/tag-repo.interface';
import Tag from '../domain/entities/tag.entity';
import { TX } from '../../../@types/prisma/prisma.type';

@Injectable()
export default class TagService {
  constructor(@Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository) {}

  async createMany(tagNames: string[], tx: TX): Promise<Tag[]> {
    const tags = tagNames.map((name) => Tag.create({ name }));
    return this.tagRepository.createMany(tags, tx);
  }
}
