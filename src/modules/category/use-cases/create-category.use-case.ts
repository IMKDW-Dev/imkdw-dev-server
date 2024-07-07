import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../common/interfaces/use-case.interface';
import { CreateCategoryDto } from '../dto/internal/create-category.dto';
import Category from '../domain/models/category.model';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import { DuplicateCategoryNameException } from '../../../common/exceptions/409';
import CategoryImageService from '../services/category-image.service';

@Injectable()
export default class CreateCategoryUseCase implements UseCase<CreateCategoryDto, Category> {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    private readonly categoryImageService: CategoryImageService,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    const categoryByName = await this.categoryRepository.findOne({ name: dto.name });
    if (categoryByName) {
      throw new DuplicateCategoryNameException(`${dto.name}은 이미 존재하는 카테고리 이름입니다.`);
    }

    const nextSort = await this.categoryRepository.findNextSort();
    const category = await this.categoryRepository.save(
      new Category.builder().setName(dto.name).setDesc(dto.desc).setSort(nextSort).build(),
    );

    const image = await this.categoryImageService.getImage(category, dto.image);
    category.changeImage(image);

    return this.categoryRepository.update(category);
  }
}
