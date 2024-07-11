import { ClassProvider, Provider } from '@nestjs/common';
import CategoryService from './services/category.service';
import CategoryImageService from './services/category-image.service';
import CreateCategoryUseCase from './use-cases/create-category.use-case';
import DeleteCategoryUseCase from './use-cases/delete-category.use-case';
import UpdateCategoryUseCase from './use-cases/update-category.use-case';
import CategoryRepository from './infra/category.repository';
import CategoryController from './controllers/category.controller';
import { CATEGORY_REPOSITORY } from './repository/category-repo.interface';

const services: Provider[] = [CategoryService, CategoryImageService];
const usecases: Provider[] = [CreateCategoryUseCase, DeleteCategoryUseCase, UpdateCategoryUseCase];
const repositories: ClassProvider[] = [
  {
    provide: CATEGORY_REPOSITORY,
    useClass: CategoryRepository,
  },
];

export const categoryControllers = [CategoryController];
export const categoryProviders = [...services, ...usecases, ...repositories];
