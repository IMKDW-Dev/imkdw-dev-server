import { Inject, Injectable } from '@nestjs/common';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';

import { ARTICLE_REPOSITORY, IArticleRepository } from '../../repository/article/article-repo.interface';
import { CreateArticleDto } from '../../dto/internal/article/create-article.dto';
import { DuplicateArticleIdException } from '../../../../common/exceptions/409';
import ArticleTagService from '../../../articleTag/services/article-tag.service';
import ArticleImageService from './article-image.service';
import CategoryQueryService from '../../../category/services/category-query.service';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../../common/exceptions/404';
import { GetArticlesDto } from '../../dto/internal/article/get-article.dto';
import { GetArticleSort } from '../../enums/article.enum';
import Article from '../../domain/entities/article.entity';
import ArticleId from '../../domain/value-objects/article-id.vo';
import ResponseCreateArticleDto from '../../dto/response/create-article.dto';
import ArticleDto from '../../dto/article.dto';
import * as ArticleMapper from '../../mappers/article.mapper';
import ResponseGetArticlesDto from '../../dto/response/get-article.dto';
import { getOffsetPagingResult } from '../../../../common/functions/offset-paging.function';
import {
  ARTICLE_COMMENT_REPOSITORY,
  IArticleCommentRepository,
} from '../../repository/article-comment/article-comment-repo.interface';

@Injectable()
export default class ArticleService {
  constructor(
    /** 영속성 레이어 */
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,

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

  async getArticles(dto: GetArticlesDto): Promise<ResponseGetArticlesDto> {
    let articles: Article[] = [];
    let allCounts = 0;
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
          {
            limit: dto.limit,
            orderBy: { createdAt: 'desc' },
            excludeId: dto?.excludeId,
            page: dto.page,
            search: dto?.search,
          },
        );
        allCounts = await this.articleRepository.findCounts({ category });
        break;
      case GetArticleSort.POPULAR:
        articles = await this.articleRepository.findMany(
          { category },
          {
            limit: dto.limit,
            orderBy: { viewCount: 'desc' },
            excludeId: dto?.excludeId,
            page: dto.page,
            search: dto?.search,
          },
        );
        allCounts = await this.articleRepository.findCounts({ category });
        break;
      default:
        break;
    }

    const articleDtos = articles.map(ArticleMapper.toDto);
    const offsetPagingResult = getOffsetPagingResult({
      items: articleDtos,
      totalCount: allCounts,
      limit: dto.limit,
      currentPage: dto.page,
    });

    return ResponseGetArticlesDto.create(offsetPagingResult);
  }

  async addViewCount(articleId: string): Promise<void> {
    const article = await this.articleRepository.findOne({ id: new ArticleId(articleId) });
    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    article.addViewCount();
    await this.articleRepository.update(article.id, article);
  }

  @Transactional()
  async deleteArticle(articleId: string): Promise<void> {
    console.log('Hello');
    const article = await this.articleRepository.findOne({ id: new ArticleId(articleId) });
    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    /**
     * 삭제 순서
     * 1. 댓글 삭제
     * 2. 게시글-태그 조인테이블 삭제
     * 3. 게시글 삭제
     */
    await this.articleCommentRepository.deleteByArticleId(articleId);
    await this.articleTagService.deleteByArticleId(articleId);
    await this.articleRepository.delete(article);
  }
}
