import { Module } from '@nestjs/common';
import CategoryController from './controllers/category.controller';
import CategoryQueryService from './services/category-query.service';
import CategoryRepository from './infra/category.repository';
import CategoryService from './services/category.service';
import { CATEGORY_REPOSITORY } from './repository/category-repo.interface';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryQueryService,
    CategoryService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
  ],
})
export default class CategoryModule {}
