import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { CreateArticleDto } from '../dto/internal/create-article.dto';
import { DuplicateArticleIdException } from '../../../common/exceptions/409';
import ArticleTagService from '../../articleTag/services/article-tag.service';
import ArticleImageService from './article-image.service';
import CategoryQueryService from '../../category/services/category-query.service';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../common/exceptions/404';
import { GetArticlesDto } from '../dto/internal/get-article.dto';
import { GetArticleSort } from '../enums/article.enum';
import Article from '../domain/entities/article.entity';
import ArticleId from '../domain/value-objects/article-id.vo';
import ResponseCreateArticleDto from '../dto/response/create-article.dto';
import ArticleDto from '../dto/article.dto';
import * as ArticleMapper from '../mappers/article.mapper';

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

    const articleId = new ArticleId(dto.id);
    const article = await this.articleRepository.findOne({ id: articleId });
    if (article) {
      throw new DuplicateArticleIdException(dto.id.toString());
    }

    const thumbnail = await this.articleImageService.getThumbnail(dto.id.toString(), file);
    const newArticle = Article.create({
      id: articleId,
      title: dto.title,
      content: dto.content,
      thumbnail,
      category,
      visible: dto.visible,
    });
    newArticle.addHashOnId();

    // TODO: 트랜잭션 처리
    const createdArticle = await this.articleRepository.save(newArticle);
    await this.articleTagService.createTags(createdArticle, dto.tags);

    return ResponseCreateArticleDto.create(createdArticle);
  }

  async getArticleDetail(articleId: string): Promise<ArticleDto> {
    const articleDetail = await this.articleRepository.findOne({ id: new ArticleId(articleId) });
    if (!articleDetail) {
      throw new ArticleNotFoundException(articleId);
    }

    return ArticleMapper.toDto(articleDetail);
  }

  async addCommentCount(article: Article): Promise<void> {
    article.addCommentCount();
    await this.articleRepository.update(article.id, article);
  }

  async getArticles(dto: GetArticlesDto): Promise<ArticleDto[]> {
    let articles: Article[] = [];
    let category = null;

    if (dto?.categoryId) {
      category = await this.categoryQueryService.findOne({ id: dto.categoryId });
      if (!category) {
        throw new CategoryNotFoundException(dto.categoryId);
      }
    }

    switch (dto.sort) {
      case GetArticleSort.LATEST:
        articles = await this.articleRepository.findMany(
          { category },
          { limit: dto.limit, orderBy: { createdAt: 'desc' }, excludeId: dto?.excludeId || '' },
        );
        break;
      case GetArticleSort.POPULAR:
        articles = await this.articleRepository.findMany(
          { category },
          { limit: dto.limit, orderBy: { viewCount: 'desc' }, excludeId: dto?.excludeId || '' },
        );
        break;
      default:
        break;
    }

    console.log(articles);
    return articles.map(ArticleMapper.toDto);
  }
}
