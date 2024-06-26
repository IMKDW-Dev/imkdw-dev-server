import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

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
import { UpdateArticleDto } from '../../dto/internal/article/update-article.dto';
import ArticleContent from '../../domain/vo/article-content.vo';
import CategoryService from '../../../category/services/category.service';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { ArticleQueryFilter } from '../../repository/article/article-query.filter';
import Article from '../../domain/models/article.model';
import { ArticleQueryOption } from '../../repository/article/article-query.option';
import PrismaService from '../../../../infra/database/prisma.service';

@Injectable()
export default class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
    private readonly prisma: PrismaService,
    private readonly articleImageService: ArticleImageService,
    private readonly articleTagService: ArticleTagService,
    private readonly categoryService: CategoryService,
  ) {}

  @Transactional()
  async createArticle(dto: CreateArticleDto, file: Express.Multer.File): Promise<ArticleDto> {
    const category = await this.categoryService.findOneOrThrow({ id: dto.categoryId });

    const article = await this.articleRepository.findOne({ articleId: dto.id });
    if (article) {
      throw new DuplicateArticleIdException(dto.id.toString());
    }

    const articleId = new ArticleId(dto.id);
    articleId.addHash();
    const thumbnail = await this.articleImageService.getThumbnail(articleId.toString(), file);

    const articleContent = new ArticleContent(dto.content);
    if (dto?.images && dto.images.length) {
      const copiedImageUrls = await this.articleImageService.copyContentImages(articleId.toString(), dto.images);
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

    const createdArticle = await this.articleRepository.save(newArticle);
    await this.articleTagService.createTags(createdArticle, dto.tags);
    await this.categoryService.addArticleCount(category);
    return ArticleMapper.toDto(createdArticle);
  }

  async getArticleDetail(articleId: string, userRole: string): Promise<ArticleDto> {
    const articleDetail = await this.findOneOrThrow({ articleId, includePrivate: userRole === userRoles.admin.name });
    const comments = await this.articleCommentRepository.findMany({ articleId: articleDetail.getId() });
    articleDetail.setComments(comments);

    return ArticleMapper.toDto(articleDetail);
  }

  async getArticles(dto: GetArticlesDto, userRole: string): Promise<ResponseGetArticlesDto> {
    const queryFilter: ArticleQueryFilter = {
      includePrivate: userRole === userRoles.admin.name,
      categoryId: dto?.categoryId,
    };

    const queryOption: ArticleQueryOption = {
      page: dto.page,
      limit: dto.limit,
      orderBy: dto.sort === GetArticleSort.LATEST ? { createdAt: 'desc' } : { viewCount: 'desc' },
      excludeId: dto?.excludeId,
      search: dto?.search,
    };

    const articles = await this.articleRepository.findMany(queryFilter, queryOption);
    const allCounts = await this.articleRepository.findCounts(queryFilter, queryOption);
    return getOffsetPagingResult({
      items: articles.map((article) => ArticleMapper.toDto(article)),
      totalCount: allCounts,
      limit: dto.limit,
      currentPage: dto.page,
    });
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

    await this.articleCommentRepository.deleteByArticleId(articleId);
    await this.articleTagService.deleteByArticleId(articleId);
    await this.articleRepository.delete(article);
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
      const category = await this.categoryService.findOneOrThrow({ id: dto.categoryId });
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
      throw new ArticleNotFoundException(`${JSON.stringify(filter)}을 찾을 수 없습니다.`);
    }

    return article;
  }

  async findIds(filter: ArticleQueryFilter) {
    return this.articleRepository.findIds(filter);
  }
}
