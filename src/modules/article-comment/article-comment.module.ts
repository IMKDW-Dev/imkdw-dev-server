import { Module } from '@nestjs/common';
import ArticleCommentController from './controllers/article-comment.controller';
import ArticleCommentService from './services/article-comment.service';
import { ARTICLE_COMMENT_REPOSITORY } from './repository/article-comment-repo.interface';
import ArticleCommentRepository from './infra/article-comment.repository';
import ArticleModule from '../article/article.module';

@Module({
  imports: [ArticleModule],
  controllers: [ArticleCommentController],
  providers: [
    ArticleCommentService,
    {
      provide: ARTICLE_COMMENT_REPOSITORY,
      useClass: ArticleCommentRepository,
    },
  ],
})
export default class ArticleCommentModule {}
