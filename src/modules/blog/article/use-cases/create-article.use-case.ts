import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/internal/create-article.dto';
import Article from '../domain/models/article.model';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import ArticleImageService from '../services/article-image.service';
import ArticleId from '../domain/vo/article-id.vo';
import ArticleContent from '../domain/vo/article-content.vo';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import CategoryValidatorService from '../../category/services/category-validator.service';
import CategoryCounterService from '../../category/services/category-counter.service';
import ArticleTagService from '../services/article-tag.service';

@Injectable()
export default class CreateArticleUseCase implements UseCase<CreateArticleDto, Article> {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    private readonly categoryValidatorService: CategoryValidatorService,
    private readonly categoryCounterService: CategoryCounterService,
    private readonly articleImageService: ArticleImageService,
    private readonly articleTagService: ArticleTagService,
  ) {}

  async execute(dto: CreateArticleDto): Promise<Article> {
    const category = await this.categoryValidatorService.findOneOrThrow({ id: dto.categoryId });

    const articleId = new ArticleId(dto.id);
    articleId.addHash();
    const thumbnail = await this.articleImageService.getThumbnail(articleId, dto.thumbnail);

    const articleContent = new ArticleContent(dto.content);
    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(articleId, dto.images);
      articleContent.updateImageUrls(copiedImageUrls);
    }

    const newArticle = new Article.builder()
      .setId(articleId.toString())
      .setTitle(dto.title)
      .setContent(articleContent.toString())
      .setThumbnail(thumbnail)
      .setCategory(category)
      .setVisible(dto.visible)
      .build();

    const createdArticle = await this.articleRepository.save(newArticle);
    await this.articleTagService.createTags(createdArticle, dto.tags);
    await this.categoryCounterService.addArticleCount(category);

    return createdArticle;
  }
}
