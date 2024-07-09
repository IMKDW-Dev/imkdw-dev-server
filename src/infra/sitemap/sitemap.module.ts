import { Module } from '@nestjs/common';
import SitemapController from './controllers/sitemap.controller';
import SitemapService from './services/sitemap.service';
import BlogModule from '../../modules/blog/blog.module';

@Module({
  imports: [BlogModule],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export default class SitemapModule {}
