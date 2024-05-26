import { Module } from '@nestjs/common';
import ArticleController from './controllers/article.controller';
import ArticleService from './services/article.service';
import { ARTICLE_REPOSITORY } from './repository/article-repo.interface';
import ArticleRepository from './infra/article.repository';
import ArticleTagModule from '../articleTag/article-tag.module';
import ArticleImageService from './services/article-image.service';
import ImageModule from '../../infra/image/image.module';
import StorageModule from '../../infra/storage/storage.module';
import CategoryModule from '../category/category.module';
import ArticleQueryService from './services/article-query.service';

@Module({
  imports: [ArticleTagModule, ImageModule, StorageModule, CategoryModule],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    { provide: ARTICLE_REPOSITORY, useClass: ArticleRepository },
    ArticleImageService,
    ArticleQueryService,
  ],
  exports: [ArticleQueryService, ArticleService],
})
export default class ArticleModule {}
