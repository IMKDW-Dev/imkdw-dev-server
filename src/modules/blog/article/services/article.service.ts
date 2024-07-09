import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { CreateArticleDto } from '../dto/internal/create-article.dto';
import { ArticleNotFoundException } from '../../../../common/exceptions/404';
import { GetArticlesDto } from '../dto/internal/get-article.dto';
import ArticleDto from '../dto/article.dto';
import * as ArticleMapper from '../mappers/article.mapper';
import ResponseGetArticlesDto from '../dto/response/get-article.dto';
import { getOffsetPagingResult } from '../../../../common/functions/offset-paging.function';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import Article from '../domain/models/article.model';
import CreateArticleUseCase from '../use-cases/create-article.use-case';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../comment/repository/comment-repo.interface';
import UpdateArticleUseCase from '../use-cases/update-article.use-case';
import IncreaseViewCountUseCase from '../use-cases/increate-view-count.use-case';
import DeleteArticleUseCase from '../use-cases/delete-article.use-case';
import GetArticleDetailUseCase from '../use-cases/get-article-detail.use-case';
import GetArticlesUseCase from '../use-cases/get-articles.use-case';

@Injectable()
export default class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(COMMENT_REPOSITORY) private readonly commentRepository: ICommentRepository,
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
    private readonly increaseViewCountUseCase: IncreaseViewCountUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
    private readonly getArticleDetailUseCase: GetArticleDetailUseCase,
    private readonly getArticlesUseCase: GetArticlesUseCase,
  ) {}

  @Transactional()
  async createArticle(dto: CreateArticleDto): Promise<ArticleDto> {
    const createdArticle = await this.createArticleUseCase.execute(dto);
    return ArticleMapper.toDto(createdArticle);
  }

  async getArticleDetail(articleId: string, userRole: string): Promise<ArticleDto> {
    const articleDetail = await this.getArticleDetailUseCase.execute({ articleId, userRole });
    return ArticleMapper.toDto(articleDetail);
  }

  async getArticles(dto: GetArticlesDto): Promise<ResponseGetArticlesDto> {
    const { articles, totalCount } = await this.getArticlesUseCase.execute(dto);
    return getOffsetPagingResult({
      items: articles.map((article) => ArticleMapper.toDto(article)),
      totalCount,
      limit: dto.limit,
      currentPage: dto.page,
    });
  }

  async increaseViewCount(articleId: string, userRole: string): Promise<void> {
    await this.increaseViewCountUseCase.execute({ articleId, userRole });
  }

  async deleteArticle(articleId: string): Promise<void> {
    await this.deleteArticleUseCase.execute(articleId);
  }

  async updateArticle(dto: UpdateArticleDto) {
    const updatedArticle = await this.updateArticleUseCase.execute(dto);
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
