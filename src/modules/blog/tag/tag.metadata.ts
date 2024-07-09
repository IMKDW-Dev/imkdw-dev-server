import { ClassProvider, Provider } from '@nestjs/common';
import TagService from './services/tag.service';
import { TAG_REPOSITORY } from './repository/tag-repo.interface';
import TagRepository from './infra/tag.repository';
import CreateTagUseCase from './use-cases/create-tag.use-case';

const services: Provider[] = [TagService];
const usecases: Provider[] = [CreateTagUseCase];
const repositories: ClassProvider[] = [
  {
    provide: TAG_REPOSITORY,
    useClass: TagRepository,
  },
];

// eslint-disable-next-line import/prefer-default-export
export const tagProviders = [...services, ...usecases, ...repositories];
