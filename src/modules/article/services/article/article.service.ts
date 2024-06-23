import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

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
import ArticleDto from '../../dto/article.dto';
import * as ArticleMapper from '../../mappers/article.mapper';
import ResponseGetArticlesDto from '../../dto/response/article/get-article.dto';
import { getOffsetPagingResult } from '../../../../common/functions/offset-paging.function';
import {
  ARTICLE_COMMENT_REPOSITORY,
  IArticleCommentRepository,
} from '../../repository/article-comment/article-comment-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../../infra/database/prisma';
import { UpdateArticleDto } from '../../dto/internal/article/update-article.dto';
import ArticleContent from '../../domain/value-objects/article-content.vo';
import UserRoles from '../../../user/enums/user-role.enum';
import CategoryService from '../../../category/services/category.service';

@Injectable()
export default class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
    @Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
    private readonly articleImageService: ArticleImageService,
    private readonly articleTagService: ArticleTagService,
    private readonly categoryQueryService: CategoryQueryService,
    private readonly categoryService: CategoryService,
  ) {}

  async createArticle(dto: CreateArticleDto, file: Express.Multer.File): Promise<Article> {
    const category = await this.categoryQueryService.findOne({ id: dto.categoryId });
    if (!category) {
      throw new CategoryNotFoundException(dto.categoryId);
    }

    const articleId = new ArticleId(dto.id);
    articleId.addHash();

    const article = await this.articleRepository.findOne({ id: articleId });
    if (article) {
      throw new DuplicateArticleIdException(dto.id.toString());
    }

    const thumbnail = await this.articleImageService.getThumbnail(articleId, file);

    const articleContent = new ArticleContent(dto.content);
    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(articleId, dto.images);
      articleContent.replaceImageUrls(copiedImageUrls);
    }

    const newArticle = Article.create({
      id: articleId,
      title: dto.title,
      content: articleContent,
      thumbnail,
      category,
      visible: dto.visible,
    });

    return this.prisma.client.$transaction(async (tx) => {
      const createdArticle = await this.articleRepository.save(newArticle, tx);
      await this.articleTagService.createTags(createdArticle, dto.tags, tx);
      await this.categoryService.addArticleCount(category, tx);
      return createdArticle;
    });
  }

  async getArticleDetail(articleId: string, userRole: string): Promise<ArticleDto> {
    const articleDetail = await this.articleRepository.findOne({
      id: new ArticleId(articleId),
      includePrivate: userRole === UserRoles.ADMIN,
    });
    if (!articleDetail) {
      throw new ArticleNotFoundException(articleId);
    }

    return ArticleMapper.toDto(articleDetail);
  }

  async addCommentCount(article: Article): Promise<void> {
    article.addCommentCount();
    await this.articleRepository.update(article);
  }

  async getArticles(dto: GetArticlesDto, userRole: string): Promise<ResponseGetArticlesDto> {
    let articles: Article[] = [];
    let allCounts = 0;
    let category = null;

    if (dto?.categoryId) {
      category = await this.categoryQueryService.findOne({ id: dto.categoryId });
      if (!category) {
        throw new CategoryNotFoundException(dto.categoryId);
      }
    }

    // TODO: 리팩토링
    switch (dto.sort) {
      case GetArticleSort.LATEST:
        articles = await this.articleRepository.findMany(
          { category, includePrivate: userRole === UserRoles.ADMIN },
          {
            limit: dto.limit,
            orderBy: { createdAt: 'desc' },
            excludeId: dto?.excludeId,
            page: dto.page,
            search: dto?.search,
          },
        );
        allCounts = await this.articleRepository.findCounts({ category }, { search: dto?.search });
        break;
      case GetArticleSort.POPULAR:
        articles = await this.articleRepository.findMany(
          { category, includePrivate: userRole === UserRoles.ADMIN },
          {
            limit: dto.limit,
            orderBy: { viewCount: 'desc' },
            excludeId: dto?.excludeId,
            page: dto.page,
            search: dto?.search,
          },
        );
        allCounts = await this.articleRepository.findCounts({ category }, { search: dto?.search });
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

  async addViewCount(articleId: string, userRole: string): Promise<void> {
    const article = await this.articleRepository.findOne({
      id: new ArticleId(articleId),
      includePrivate: userRole === UserRoles.ADMIN,
    });

    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    article.addViewCount();
    await this.articleRepository.update(article);
  }

  async deleteArticle(articleId: string): Promise<void> {
    const article = await this.articleRepository.findOne({ id: new ArticleId(articleId) });
    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    await this.prisma.client.$transaction(async (tx) => {
      await Promise.all([
        this.articleCommentRepository.deleteByArticleId(articleId, tx),
        this.articleTagService.deleteByArticleId(articleId, tx),
        this.articleRepository.delete(article, tx),
      ]);
    });
  }

  async updateArticle(articleId: string, dto: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({ id: new ArticleId(articleId) });
    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    article.changeTitle(dto.title);
    article.changeContent(new ArticleContent(dto.content));
    article.changeVisible(dto.visible);

    if (dto?.thumbnail) {
      const thumbnail = await this.articleImageService.getThumbnail(article.id, dto.thumbnail);
      article.changeThumbnail(thumbnail);
    }

    if (dto?.categoryId) {
      const category = await this.categoryQueryService.findOne({ id: dto.categoryId });
      if (!category) {
        throw new CategoryNotFoundException(dto.categoryId);
      }
      article.changeCategory(category);
    }

    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(article.id, dto.images);
      article.content.replaceImageUrls(copiedImageUrls);
      article.changeContent(article.content);
    }

    const updatedArticle = await this.articleRepository.update(article);
    return ArticleMapper.toDto(updatedArticle);
  }
}
