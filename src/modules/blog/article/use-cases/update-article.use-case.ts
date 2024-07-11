import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import Article from '../domain/models/article.model';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../category/repository/category-repo.interface';
import ArticleImageService from '../services/article-image.service';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../../common/exceptions/404';
import Category from '../../category/domain/models/category.model';

@Injectable()
export default class UpdateArticleUseCase implements UseCase<UpdateArticleDto, Article> {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly cateRepository: ICategoryRepository,
    private readonly articleImageService: ArticleImageService,
  ) {}

  async execute(dto: UpdateArticleDto): Promise<Article> {
    const article = await this.getArticle(dto.articleId);

    article.changeTitle(dto.title);
    article.changeContent(dto.content);
    article.changeVisible(dto.visible);

    if (dto?.thumbnail) {
      const thumbnail = await this.articleImageService.getThumbnail(article.getId(), dto.thumbnail);
      article.changeThumbnail(thumbnail);
    }

    if (dto.categoryId !== article.getCategoryId()) {
      const category = await this.getCategory(dto.categoryId);
      article.changeCategory(category);
    }

    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(article.getId(), dto.images);
      article.updateImageUrls(copiedImageUrls);
    }

    return this.articleRepository.update(article);
  }

  private async getArticle(articleId: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ articleId });
    if (!article) {
      throw new ArticleNotFoundException(`${articleId}을 찾을 수 없습니다.`);
    }

    return article;
  }

  private async getCategory(categoryId: number): Promise<Category> {
    const category = await this.cateRepository.findOne({ id: categoryId });
    if (!category) {
      throw new CategoryNotFoundException(`${categoryId}을 찾을 수 없습니다.`);
    }

    return category;
  }
}
