import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { ArticleNotFoundException } from '../../../../common/exceptions/404';

@Injectable()
export default class DeleteArticleUseCase implements UseCase<string, void> {
  constructor(@Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository) {}

  async execute(articleId: string): Promise<void> {
    const article = await this.articleRepository.findOne({ articleId });
    if (!article) {
      throw new ArticleNotFoundException(`articleId: ${articleId}을 찾을 수 없습니다.`);
    }

    await this.articleRepository.delete(article);
  }
}
