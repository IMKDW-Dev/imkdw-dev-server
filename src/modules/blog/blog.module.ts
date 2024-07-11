import { Module } from '@nestjs/common';
import { articleControllers, articleProviders } from './article/article.metadata';
import { categoryControllers, categoryProviders } from './category/category.metadata';
import { commentControllers, commentProviders } from './comment/comment.metadata';
import ImageModule from '../../infra/image/image.module';
import StorageModule from '../../infra/storage/storage.module';
import ArticleService from './article/services/article.service';
import CategoryService from './category/services/category.service';
import { tagProviders } from './tag/tag.metadata';
import UserModule from '../user/user.module';

@Module({
  imports: [ImageModule, StorageModule, UserModule],
  controllers: [...articleControllers, ...categoryControllers, ...commentControllers],
  providers: [...articleProviders, ...categoryProviders, ...commentProviders, ...tagProviders],
  exports: [ArticleService, CategoryService],
})
export default class BlogModule {}
