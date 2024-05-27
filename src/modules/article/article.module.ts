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
import { ARTICLE_DETAIL_REPOSITORY } from './repository/article-detail-repo.interface';
import ArticleDetailRepository from './infra/article-detail.repository';
import { ARTICLE_SUMMARY_REPOSITORY } from './repository/article-summary-repo.interface';
import ArticleSummaryRepository from './infra/article-summary.repository';

@Module({
  imports: [ArticleTagModule, ImageModule, StorageModule, CategoryModule],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    { provide: ARTICLE_REPOSITORY, useClass: ArticleRepository },
    { provide: ARTICLE_DETAIL_REPOSITORY, useClass: ArticleDetailRepository },
    { provide: ARTICLE_SUMMARY_REPOSITORY, useClass: ArticleSummaryRepository },
    ArticleImageService,
    ArticleQueryService,
  ],
  exports: [ArticleQueryService, ArticleService],
})
export default class ArticleModule {}
