import { Module } from '@nestjs/common';
import TagQueryService from './services/tag-query.service';
import { TAG_REPOSITORY } from './repository/tag-repo.interface';
import TagRepository from './infra/tag.repository';
import TagService from './services/tag.service';

@Module({
  providers: [
    TagService,
    TagQueryService,
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
  ],
  exports: [TagQueryService, TagService],
})
export default class TagModule {}
