import { Module } from '@nestjs/common';
import { TAG_REPOSITORY } from './repository/tag-repo.interface';
import TagRepository from './infra/tag.repository';
import TagService from './services/tag.service';

@Module({
  providers: [
    TagService,
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
  ],
  exports: [TagService],
})
export default class TagModule {}
