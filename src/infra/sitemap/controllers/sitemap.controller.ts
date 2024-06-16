import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../modules/auth/decorators/public.decorator';
import SitemapService from '../services/sitemap.service';

@Controller({ path: 'sitemap', version: '1' })
export default class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('articles')
  @Public()
  async getArticleIds(): Promise<string[]> {
    return this.sitemapService.getArticleIds();
  }

  @Get('categories')
  @Public()
  async getCategoryNames(): Promise<string[]> {
    return this.sitemapService.getCategoryNames();
  }
}
