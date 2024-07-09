import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/internal/create-article.dto';
import Article from '../domain/models/article.model';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import ArticleImageService from '../services/article-image.service';
import ArticleId from '../domain/vo/article-id.vo';
import ArticleContent from '../domain/vo/article-content.vo';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../category/repository/category-repo.interface';
import { CategoryNotFoundException } from '../../../../common/exceptions/404';
import Category from '../../category/domain/models/category.model';
import TagService from '../../tag/services/tag.service';

@Injectable()
export default class CreateArticleUseCase implements UseCase<CreateArticleDto, Article> {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly cateRepository: ICategoryRepository,
    private readonly articleImageService: ArticleImageService,
    private readonly tagService: TagService,
  ) {}

  async execute(dto: CreateArticleDto): Promise<Article> {
    const category = await this.getCategory(dto.categoryId);
    const id = this.generateId(dto.id);
    const thumbnail = await this.articleImageService.getThumbnail(id, dto.thumbnail);
    const content = await this.generateContent(id, dto.content, dto.images);
    const tags = await this.tagService.generatArticleTags(dto.tags);

    const newArticle = new Article.builder()
      .setId(id.toString())
      .setTitle(dto.title)
      .setContent(content.toString())
      .setThumbnail(thumbnail)
      .setCategory(category)
      .setVisible(dto.visible)
      .setTags(tags)
      .build();

    return this.articleRepository.save(newArticle);
  }

  private async getCategory(categoryId: number): Promise<Category> {
    const category = await this.cateRepository.findOne({ id: categoryId });
    if (!category) {
      throw new CategoryNotFoundException(`${categoryId}을 찾을 수 없습니다.`);
    }

    return category;
  }

  private generateId(id: string): ArticleId {
    const articleId = new ArticleId(id).addHash();
    return articleId;
  }

  private async generateContent(id: ArticleId, content: string, images: string[]): Promise<ArticleContent> {
    const articleContent = new ArticleContent(content);

    if (Array.isArray(images) && images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(id, images);
      articleContent.updateImageUrls(copiedImageUrls);
    }

    return articleContent;
  }
}
