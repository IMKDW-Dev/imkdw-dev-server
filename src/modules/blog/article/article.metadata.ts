import { ClassProvider, Provider } from '@nestjs/common';
import ArticleRepository from './infra/article.repository';
import { ARTICLE_REPOSITORY } from './repository/article-repo.interface';
import ArticleService from './services/article.service';
import ArticleImageService from './services/article-image.service';
import ArticleStatsService from './services/article-stats.service';
import { ARTICLE_TAG_REPOSITORY } from './repository/article-tag-repo.inteface';
import ArticleTagRepository from './infra/article-tag.repository';
import CreateArticleUseCase from './use-cases/create-article.use-case';
import ArticleController from './controllers/article.controller';
import ArticleStatsController from './controllers/article-stats.controller';

const services: Provider[] = [ArticleService, ArticleImageService, ArticleStatsService];
const usecases: Provider[] = [CreateArticleUseCase];
const repositories: ClassProvider[] = [
  {
    provide: ARTICLE_REPOSITORY,
    useClass: ArticleRepository,
  },
  {
    provide: ARTICLE_TAG_REPOSITORY,
    useClass: ArticleTagRepository,
  },
];

export const articleControllers = [ArticleController, ArticleStatsController];
export const articleProviders = [...services, ...usecases, ...repositories];
