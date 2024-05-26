import { Inject, Injectable } from '@nestjs/common';
import { TAG_REPOSITORY } from '../repository/tag-repo.interface';
import TagRepository from '../infra/tag.repository';

@Injectable()
export default class TagQueryService {
  constructor(@Inject(TAG_REPOSITORY) private readonly tagRepository: TagRepository) {}

  async findManyByNames(names: string[]) {
    return this.tagRepository.findManyByNames(names);
  }
}
