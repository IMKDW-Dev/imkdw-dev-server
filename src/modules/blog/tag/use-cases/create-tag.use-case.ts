import { Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/internal/create-tag.dto';
import Tag from '../domain/models/tag.model';
import { ITagRepository, TAG_REPOSITORY } from '../repository/tag-repo.interface';
import { UseCase } from '../../../../common/interfaces/use-case.interface';

@Injectable()
export default class CreateTagUseCase implements UseCase<CreateTagDto, Tag[]> {
  constructor(@Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository) {}

  async execute(dto: CreateTagDto): Promise<Tag[]> {
    const tags = dto.tagNames.map((name) => new Tag.builder().setName(name).build());
    return this.tagRepository.createMany(tags);
  }
}
