import { Module } from '@nestjs/common';
import ArticleController from './controllers/article.controller';
import ArticleService from './services/article/article.service';
import { ARTICLE_REPOSITORY } from './repository/article/article-repo.interface';
import ArticleRepository from './infra/article.repository';
import ArticleTagModule from '../articleTag/article-tag.module';
import ArticleImageService from './services/article/article-image.service';
import ImageModule from '../../infra/image/image.module';
import StorageModule from '../../infra/storage/storage.module';
import CategoryModule from '../category/category.module';
import { ARTICLE_COMMENT_REPOSITORY } from './repository/article-comment/article-comment-repo.interface';
import ArticleCommentRepository from './infra/article-comment.repository';
import ArticleCommentController from './controllers/article-comment.controller';
import UserModule from '../user/user.module';
import ArticleCommentService from './services/article-comment/article-comment.service';
import ArticleStatsController from './controllers/article-stats.controller';
import ArticleStatsService from './services/article/article-stats.service';

@Module({
  imports: [ArticleTagModule, ImageModule, StorageModule, CategoryModule, UserModule],
  controllers: [ArticleController, ArticleCommentController, ArticleStatsController],
  providers: [
    ArticleService,
    ArticleImageService,
    ArticleCommentService,
    ArticleStatsService,
    { provide: ARTICLE_REPOSITORY, useClass: ArticleRepository },
    { provide: ARTICLE_COMMENT_REPOSITORY, useClass: ArticleCommentRepository },
  ],
  exports: [ArticleService],
})
export default class ArticleModule {}
