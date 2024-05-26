import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { CreateArticleDto } from '../dto/internal/create-article.dto';
import { DuplicateArticleIdException } from '../../../common/exceptions/409';
import ArticleTagService from '../../articleTag/services/article-tag.service';
import ArticleImageService from './article-image.service';
import { ArticleBuilder } from '../domain/entities/article.entity';
import CategoryQueryService from '../../category/services/category-query.service';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../common/exceptions/404';
import ResponseCreateArticleDto from '../dto/response/create-article.dto';
import ArticleDetailDto from '../dto/article-detail.dto';

@Injectable()
export default class ArticleService {
  constructor(
    /** 영속성 레이어 */
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,

    /** 게시글 서비스 */
    private readonly articleImageService: ArticleImageService,
    private readonly articleTagService: ArticleTagService,

    /** 카테고리 서비스 */
    private readonly categoryQueryService: CategoryQueryService,
  ) {}

  async createArticle(dto: CreateArticleDto, file: Express.Multer.File): Promise<ResponseCreateArticleDto> {
    const category = await this.categoryQueryService.findOne({ id: dto.categoryId });
    if (!category) {
      throw new CategoryNotFoundException(dto.categoryId);
    }

    const article = await this.articleRepository.findOne({ id: dto.id });
    if (article) {
      throw new DuplicateArticleIdException(dto.id);
    }

    const thumbnail = await this.articleImageService.getThumbnail(dto.id, file);
    const newArticle = new ArticleBuilder()
      .setId(dto.id)
      .setTitle(dto.title)
      .setContent(dto.content)
      .setThumbnail(thumbnail)
      .setCategory(category)
      .setVisible(dto.visible)
      .build();
    newArticle.addHashOnId();

    // TODO: 트랜잭션 처리
    const createdArticle = await this.articleRepository.save(newArticle);
    await this.articleTagService.createTags(createdArticle, dto.tags);

    return new ResponseCreateArticleDto(createdArticle.getId());
  }

  async getArticleDetail(articleId: string): Promise<ArticleDetailDto> {
    const articleDetail = await this.articleRepository.findArticleDetail({ id: articleId });
    if (!articleDetail) {
      throw new ArticleNotFoundException(articleId);
    }

    return articleDetail.toDto();
  }
}
