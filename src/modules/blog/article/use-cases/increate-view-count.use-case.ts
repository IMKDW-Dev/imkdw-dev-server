import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { IncreaseViewCountDto } from '../dto/internal/increate-view-count.dto';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { ArticleNotFoundException } from '../../../../common/exceptions/404';

@Injectable()
export default class IncreaseViewCountUseCase implements UseCase<IncreaseViewCountDto, void> {
  constructor(@Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository) {}

  async execute(dto: IncreaseViewCountDto): Promise<void> {
    const article = await this.articleRepository.findOne({
      articleId: dto.articleId,
      includePrivate: dto.userRole === userRoles.admin.name,
    });

    if (!article) {
      throw new ArticleNotFoundException(`게시글 아이디 ${dto.articleId}을 찾을 수 없습니다.`);
    }

    article.increaseViewCount();
    await this.articleRepository.update(article);
  }
}
