import { Module } from '@nestjs/common';
import CategoryController from './controllers/category.controller';
import CategoryQueryService from './services/category-query.service';
import CategoryRepository from './infra/category.repository';
import CategoryService from './services/category.service';
import { CATEGORY_REPOSITORY } from './repository/category-repo.interface';
import ImageModule from '../../infra/image/image.module';
import CategoryImageService from './services/category-image.service';
import StorageModule from '../../infra/storage/storage.module';
import { CATEGORY_DETAIL_REPOSITORY } from './repository/category-detail-repo.interface';
import CategoryDetailRepository from './infra/category-detail.repository';

@Module({
  imports: [ImageModule, StorageModule],
  controllers: [CategoryController],
  providers: [
    CategoryQueryService,
    CategoryService,
    CategoryImageService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    {
      provide: CATEGORY_DETAIL_REPOSITORY,
      useClass: CategoryDetailRepository,
    },
  ],
  exports: [CategoryQueryService],
})
export default class CategoryModule {}
