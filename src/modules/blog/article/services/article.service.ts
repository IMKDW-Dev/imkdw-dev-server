import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { CreateArticleDto } from '../dto/internal/create-article.dto';
import ArticleTagService from './article-tag.service';
import ArticleImageService from './article-image.service';
import { ArticleNotFoundException } from '../../../../common/exceptions/404';
import { GetArticlesDto } from '../dto/internal/get-article.dto';
import { GetArticleSort } from '../enums/article.enum';
import ArticleDto from '../dto/article.dto';
import * as ArticleMapper from '../mappers/article.mapper';
import ResponseGetArticlesDto from '../dto/response/get-article.dto';
import { getOffsetPagingResult } from '../../../../common/functions/offset-paging.function';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import ArticleContent from '../domain/vo/article-content.vo';
import CategoryService from '../../category/services/category.service';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import Article from '../domain/models/article.model';
import { ArticleQueryOption } from '../repository/article-query.option';
import CreateArticleUseCase from '../use-cases/create-article.use-case';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../comment/repository/comment-repo.interface';

@Injectable()
export default class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(COMMENT_REPOSITORY) private readonly articleCommentRepository: ICommentRepository,
    private readonly articleImageService: ArticleImageService,
    private readonly articleTagService: ArticleTagService,
    private readonly categoryService: CategoryService,
    private readonly createArticleUseCase: CreateArticleUseCase,
  ) {}

  @Transactional()
  async createArticle(dto: CreateArticleDto): Promise<ArticleDto> {
    const createdArticle = await this.createArticleUseCase.execute(dto);
    return ArticleMapper.toDto(createdArticle);
  }

  async getArticleDetail(articleId: string, userRole: string): Promise<ArticleDto> {
    const articleDetail = await this.findOneOrThrow({ articleId, includePrivate: userRole === userRoles.admin.name });
    const comments = await this.articleCommentRepository.findMany({ articleId: articleDetail.getId().toString() });
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

    // if (dto?.categoryId) {
    //   const category = await this.categoryService.findOneOrThrow({ id: dto.categoryId });
    //   if (!category) {
    //     throw new CategoryNotFoundException(dto.categoryId);
    //   }
    //   article.changeCategory(category);
    // }

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
