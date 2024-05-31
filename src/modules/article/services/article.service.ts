import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { CreateArticleDto } from '../dto/internal/create-article.dto';
import { DuplicateArticleIdException } from '../../../common/exceptions/409';
import ArticleTagService from '../../articleTag/services/article-tag.service';
import ArticleImageService from './article-image.service';
import CategoryQueryService from '../../category/services/category-query.service';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../common/exceptions/404';
import ResponseCreateArticleDto from '../dto/response/create-article.dto';
import { GetArticlesDto } from '../dto/internal/get-article.dto';
import { GetArticleFilter } from '../enums/article.enum';
import Article from '../domain/entities/article.entity';

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
      throw new DuplicateArticleIdException(dto.id.toString());
    }

    const thumbnail = await this.articleImageService.getThumbnail(dto.id.toString(), file);
    const newArticle = Article.create({
      id: dto.id,
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

    return new ResponseCreateArticleDto(createdArticle.id.toString());
  }

  async getArticleDetail(articleId: string): Promise<ArticleDetailDto> {
    const articleDetail = await this.articleRepository.findOne({ id: articleId });
    if (!articleDetail) {
      throw new ArticleNotFoundException(articleId);
    }

    return articleDetail;
  }

  async addCommentCount(article: Article): Promise<void> {
    article.addCommentCount();
    await this.articleRepository.update(article, article);
  }

  async getArticles(dto: GetArticlesDto): Promise<Article[]> {
    let articles: Article[] = [];

    switch (dto.filter) {
      case GetArticleFilter.LATEST:
        articles = await this.articleRepository.findLatestArticles({ limit: dto.limit });
        break;
      case GetArticleFilter.POPULAR:
        articles = await this.articleRepository.findManyOrderByViewCount({ limit: dto.limit });
        break;
      default:
        break;
    }
    return articles;
  }
}
