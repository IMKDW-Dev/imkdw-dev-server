import { Module } from '@nestjs/common';
import SitemapController from './controllers/sitemap.controller';
import SitemapService from './services/sitemap.service';
import ArticleModule from '../../modules/article/article.module';
import CategoryModule from '../../modules/category/category.module';

@Module({
  imports: [ArticleModule, CategoryModule],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export default class SitemapModule {}
