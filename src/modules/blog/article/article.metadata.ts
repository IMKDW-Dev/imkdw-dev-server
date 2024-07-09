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
import UpdateArticleUseCase from './use-cases/update-article.use-case';
import IncreaseViewCountUseCase from './use-cases/increate-view-count.use-case';
import DeleteArticleUseCase from './use-cases/delete-article.use-case';
import GetArticleDetailUseCase from './use-cases/get-article-detail.use-case';

const services: Provider[] = [ArticleService, ArticleImageService, ArticleStatsService];
const usecases: Provider[] = [
  CreateArticleUseCase,
  UpdateArticleUseCase,
  IncreaseViewCountUseCase,
  DeleteArticleUseCase,
  GetArticleDetailUseCase,
];
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
