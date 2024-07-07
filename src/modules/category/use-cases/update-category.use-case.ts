import { Inject, Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import Category from '../domain/models/category.model';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import CategoryImageService from '../services/category-image.service';
import { UseCase } from '../../../common/interfaces/use-case.interface';
import { CategoryNotFoundException } from '../../../common/exceptions/404';

@Injectable()
export default class UpdateCategoryUseCase implements UseCase<UpdateCategoryDto, Category> {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    private readonly categoryImageService: CategoryImageService,
  ) {}

  async execute(dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ id: dto.categoryId });
    if (!category) {
      throw new CategoryNotFoundException(`${dto.categoryId}을 찾을 수 없습니다.`);
    }

    category.changeName(dto.name);
    category.changeDesc(dto.desc);

    if (dto?.image) {
      const image = await this.categoryImageService.getImage(category, dto.image);
      category.changeImage(image);
    }

    if (dto.sort !== category.getSort()) {
      const updatedSortCategory = await this.categoryRepository.updateSort(category, dto.sort);
      category.changeSort(updatedSortCategory.getSort());
    }

    return this.categoryRepository.update(category);
  }
}
