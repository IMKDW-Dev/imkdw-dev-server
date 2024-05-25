import { Controller } from '@nestjs/common';
import ArticleService from '../services/article.service';

@Controller({ path: 'articles', version: '1' })
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
}
