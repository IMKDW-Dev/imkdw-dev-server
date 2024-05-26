import { Inject, Injectable } from '@nestjs/common';
import Tag, { TagBuilder } from '../domain/entities/tag.entity';
import { ITagRepository, TAG_REPOSITORY } from '../repository/tag-repo.interface';

@Injectable()
export default class TagService {
  constructor(@Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository) {}

  async createMany(tagNames: string[]): Promise<Tag[]> {
    const tags = tagNames.map((name) => new TagBuilder().setName(name).build());
    return this.tagRepository.createMany(tags);
  }
}
