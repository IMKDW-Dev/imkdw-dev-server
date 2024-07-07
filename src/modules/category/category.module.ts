import { Module } from '@nestjs/common';
import CategoryController from './controllers/category.controller';
import CategoryRepository from './infra/category.repository';
import CategoryService from './services/category.service';
import { CATEGORY_REPOSITORY } from './repository/category-repo.interface';
import ImageModule from '../../infra/image/image.module';
import CategoryImageService from './services/category-image.service';
import StorageModule from '../../infra/storage/storage.module';
import CreateCategoryUseCase from './use-cases/create-category.use-case';
import UpdateCategoryUseCase from './use-cases/update-category.use-case';
import DeleteCategoryUseCase from './use-cases/delete-category.use-case';

const services = [CategoryService, CategoryImageService];
const repositories = [
  {
    provide: CATEGORY_REPOSITORY,
    useClass: CategoryRepository,
  },
];
const usecases = [CreateCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase];
@Module({
  imports: [ImageModule, StorageModule],
  controllers: [CategoryController],
  providers: [...services, ...usecases, ...repositories],
  exports: [CategoryService],
})
export default class CategoryModule {}
