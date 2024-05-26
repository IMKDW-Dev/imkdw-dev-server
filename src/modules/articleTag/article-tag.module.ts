import { Module } from '@nestjs/common';
import ArticleTagService from './services/article-tag.service';
import { ARTICE_TAG_REPOSITORY } from './repository/article-tag-repo.inteface';
import ArticleTagRepository from './infra/article-tag.repository';
import TagModule from '../tag/tag.module';

@Module({
  imports: [TagModule],
  providers: [
    ArticleTagService,
    {
      provide: ARTICE_TAG_REPOSITORY,
      useClass: ArticleTagRepository,
    },
  ],
  exports: [ArticleTagService],
})
export default class ArticleTagModule {}
