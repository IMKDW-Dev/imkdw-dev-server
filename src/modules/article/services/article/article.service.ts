import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { ARTICLE_REPOSITORY, IArticleRepository } from '../../repository/article/article-repo.interface';
import { CreateArticleDto } from '../../dto/internal/article/create-article.dto';
import { DuplicateArticleIdException } from '../../../../common/exceptions/409';
import ArticleTagService from '../../../articleTag/services/article-tag.service';
import ArticleImageService from './article-image.service';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../../common/exceptions/404';
import { GetArticlesDto } from '../../dto/internal/article/get-article.dto';
import { GetArticleSort } from '../../enums/article.enum';
import ArticleId from '../../domain/vo/article-id.vo';
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
import ArticleContent from '../../domain/vo/article-content.vo';
import CategoryService from '../../../category/services/category.service';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { ArticleQueryFilter } from '../../repository/article/article-query.filter';
import Article from '../../domain/models/article.model';

@Injectable()
export default class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
    @Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
    private readonly articleImageService: ArticleImageService,
    private readonly articleTagService: ArticleTagService,
    private readonly categoryService: CategoryService,
  ) {}

  async createArticle(dto: CreateArticleDto, file: Express.Multer.File): Promise<ArticleDto> {
    const category = await this.categoryService.findOneOrThrow({ categoryId: dto.categoryId });

    const article = await this.findOneOrThrow({ articleId: dto.id });
    if (article) {
      throw new DuplicateArticleIdException(dto.id.toString());
    }

    const articleId = new ArticleId(dto.id);
    articleId.addHash();

    const thumbnail = await this.articleImageService.getThumbnail(articleId.toString(), file);

    const articleContent = new ArticleContent(dto.content);
    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(article.getId(), dto.images);
      articleContent.updateImageUrls(copiedImageUrls);
    }

    const newArticle = new Article.builder()
      .setId(articleId)
      .setTitle(dto.title)
      .setContent(articleContent)
      .setThumbnail(thumbnail)
      .setCategory(category)
      .setVisible(dto.visible)
      .build();

    return this.prisma.client.$transaction(async (tx) => {
      const createdArticle = await this.articleRepository.save(newArticle, tx);
      await this.articleTagService.createTags(createdArticle, dto.tags, tx);
      await this.categoryService.addArticleCount(category, tx);
      return createdArticle;
    });
  }

  async getArticleDetail(articleId: string, userRole: string): Promise<ArticleDto> {
    const articleDetail = await this.findOneOrThrow({ articleId, includePrivate: userRole === userRoles.admin.name });

    if (!articleDetail) {
      throw new ArticleNotFoundException(articleId);
    }

    return ArticleMapper.toDto(articleDetail);
  }

  async getArticles(dto: GetArticlesDto, userRole: string): Promise<ResponseGetArticlesDto> {
    let articles: Article[] = [];
    let allCounts = 0;
    let category = null;

    if (dto?.categoryId) {
      category = await this.categoryService.findOneOrThrow({ categoryId: dto.categoryId });
    }

    // TODO: 리팩토링
    switch (dto.sort) {
      case GetArticleSort.LATEST:
        articles = await this.articleRepository.findMany(
          { categoryId: category.getId(), includePrivate: userRole === userRoles.admin.name },
          {
            limit: dto.limit,
            orderBy: { createdAt: 'desc' },
            excludeId: dto?.excludeId,
            page: dto.page,
            search: dto?.search,
          },
        );
        allCounts = await this.articleRepository.findCounts({ categoryId: category.getId() }, { search: dto?.search });
        break;
      case GetArticleSort.POPULAR:
        articles = await this.articleRepository.findMany(
          { categoryId: category.getId(), includePrivate: userRole === userRoles.admin.name },
          {
            limit: dto.limit,
            orderBy: { viewCount: 'desc' },
            excludeId: dto?.excludeId,
            page: dto.page,
            search: dto?.search,
          },
        );
        allCounts = await this.articleRepository.findCounts({ categoryId: category.getId() }, { search: dto?.search });
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
      includePrivate: userRole === userRoles.admin.name,
    });

    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    article.addViewCount();
    await this.articleRepository.update(article);
  }

  async deleteArticle(articleId: string): Promise<void> {
    const article = await this.findOneOrThrow({ articleId });

    await this.prisma.client.$transaction(async (tx) => {
      await Promise.all([
        this.articleCommentRepository.deleteByArticleId(articleId, tx),
        this.articleTagService.deleteByArticleId(articleId, tx),
        this.articleRepository.delete(article, tx),
      ]);
    });
  }

  async updateArticle(articleId: string, dto: UpdateArticleDto) {
    const article = await this.findOneOrThrow({ articleId });
    article.changeTitle(dto.title);
    article.changeContent(new ArticleContent(dto.content));
    article.changeVisible(dto.visible);

    if (dto?.thumbnail) {
      const thumbnail = await this.articleImageService.getThumbnail(article.getId(), dto.thumbnail);
      article.changeThumbnail(thumbnail);
    }

    if (dto?.categoryId) {
      const category = await this.categoryService.findOneOrThrow({ categoryId: dto.categoryId });
      if (!category) {
        throw new CategoryNotFoundException(dto.categoryId);
      }
      article.changeCategory(category);
    }

    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(article.getId(), dto.images);
      article.updateImageUrls(copiedImageUrls);
    }

    const updatedArticle = await this.articleRepository.update(article);
    return ArticleMapper.toDto(updatedArticle);
  }

  async findOneOrThrow(filter: ArticleQueryFilter): Promise<Article> {
    const article = await this.articleRepository.findOne(filter);
    if (!article) {
      throw new ArticleNotFoundException(`${filter}을 찾을 수 없습니다.`);
    }

    return article;
  }

  async findOne(filter: ArticleQueryFilter): Promise<Article> {
    return this.articleRepository.findOne(filter);
  }

  async findIds(filter: ArticleQueryFilter) {
    return this.articleRepository.findIds(filter);
  }
}
