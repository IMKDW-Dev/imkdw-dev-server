import { Module } from '@nestjs/common';
import { TAG_REPOSITORY } from './repository/tag-repo.interface';
import TagRepository from './infra/tag.repository';
import TagService from './services/tag.service';
import CreateTagUseCase from './use-cases/create-tag.use-case';

const services = [TagService];
const usecases = [CreateTagUseCase];
const repositories = [
  {
    provide: TAG_REPOSITORY,
    useClass: TagRepository,
  },
];

@Module({
  providers: [...services, ...usecases, ...repositories],
  exports: [TagService],
})
export default class TagModule {}
