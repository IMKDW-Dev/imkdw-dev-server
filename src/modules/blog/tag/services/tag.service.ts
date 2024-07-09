import { Inject, Injectable } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '../repository/tag-repo.interface';
import Tag from '../domain/models/tag.model';
import CreateTagUseCase from '../use-cases/create-tag.use-case';
import { CreateTagDto } from '../dto/internal/create-tag.dto';

@Injectable()
export default class TagService {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository,
    private readonly createTagUseCase: CreateTagUseCase,
  ) {}

  async createTags(dto: CreateTagDto): Promise<Tag[]> {
    return this.createTagUseCase.execute(dto);
  }

  async findByNames(names: string[]) {
    return this.tagRepository.findManyByNames(names);
  }
}
