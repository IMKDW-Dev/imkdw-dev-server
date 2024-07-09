import { Inject, Injectable } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '../repository/tag-repo.interface';
import CreateTagUseCase from '../use-cases/create-tag.use-case';
import { getNewTags } from '../../article/functions/tag.function';
import Tag from '../domain/models/tag.model';

@Injectable()
export default class TagService {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository,
    private readonly createTagUseCase: CreateTagUseCase,
  ) {}

  async generatArticleTags(tagNames: string[]): Promise<Tag[]> {
    const existTags = await this.tagRepository.findManyByNames(tagNames);
    const createdTags = await this.createTagUseCase.execute({ tagNames: getNewTags(existTags, tagNames) });
    return [...existTags, ...createdTags];
  }

  async findByNames(names: string[]) {
    return this.tagRepository.findManyByNames(names);
  }
}
