import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repository/category-repo.interface';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { CategoryNotFoundException } from '../../../../common/exceptions/404';

@Injectable()
export default class DeleteCategoryUseCase implements UseCase<number, void> {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository) {}

  async execute(categoryId: number): Promise<void> {
    const category = await this.categoryRepository.findOne({ id: categoryId });
    if (!category) {
      throw new CategoryNotFoundException(`카테고리 아이디 ${categoryId}을 찾을 수 없습니다.`);
    }

    category.checkAvailableDelete();

    await this.categoryRepository.delete(category);
  }
}
