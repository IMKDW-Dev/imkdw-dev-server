import { Module } from '@nestjs/common';
import ArticleController from './controllers/article.controller';
import ArticleService from './services/article.service';
import { ARTICLE_REPOSITORY } from './repository/article-repo.interface';
import ArticleRepository from './infra/article.repository';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, { provide: ARTICLE_REPOSITORY, useClass: ArticleRepository }],
})
export default class ArticleModule {}
