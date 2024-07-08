import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../common/interfaces/use-case.interface';
import { CreateArticleDto } from '../dto/internal/article/create-article.dto';
import Article from '../domain/models/article.model';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article/article-repo.interface';
import CategoryService from '../../category/services/category.service';
import ArticleImageService from '../services/article/article-image.service';
import ArticleTagService from '../../articleTag/services/article-tag.service';
import ArticleId from '../domain/vo/article/article-id.vo';
import ArticleContent from '../domain/vo/article/article-content.vo';

@Injectable()
export default class CreateArticleUseCase implements UseCase<CreateArticleDto, Article> {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    private readonly categoryService: CategoryService,
    private readonly articleImageService: ArticleImageService,
    private readonly articleTagService: ArticleTagService,
  ) {}

  async execute(dto: CreateArticleDto): Promise<Article> {
    const category = await this.categoryService.findOneOrThrow({ id: dto.categoryId });

    const articleId = new ArticleId(dto.id);
    articleId.addHash();
    const thumbnail = await this.articleImageService.getThumbnail(articleId.toString(), dto.thumbnail);

    const articleContent = new ArticleContent(dto.content);
    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(articleId.toString(), dto.images);
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
    await this.categoryService.addArticleCount(category);

    return createdArticle;
  }
}
