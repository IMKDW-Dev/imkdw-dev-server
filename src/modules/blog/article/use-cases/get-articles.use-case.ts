import { Inject, Injectable } from '@nestjs/common';
import { GetArticlesDto } from '../dto/internal/get-article.dto';
import Article from '../domain/models/article.model';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { ArticleQueryOption } from '../repository/article-query.option';
import { GetArticleSort } from '../enums/article.enum';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';

@Injectable()
export default class GetArticlesUseCase
  implements UseCase<GetArticlesDto, { articles: Article[]; totalCount: number }>
{
  constructor(@Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository) {}

  async execute(dto: GetArticlesDto): Promise<{ articles: Article[]; totalCount: number }> {
    const queryFilter: ArticleQueryFilter = {
      includePrivate: dto.userRole === userRoles.admin.name,
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

    return { articles, totalCount: allCounts };
  }
}
