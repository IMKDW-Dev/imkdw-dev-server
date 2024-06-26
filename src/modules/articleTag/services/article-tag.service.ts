import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_TAG_REPOSITORY, IArticleTagRepository } from '../repository/article-tag-repo.inteface';
import TagService from '../../tag/services/tag.service';
import Article from '../../article/domain/entities/article.entity';
import { TX } from '../../../@types/prisma/prisma.type';
import { getNewTags } from '../functions/separate-tag.function';
import ArticleTag from '../domain/models/article-tag.model';

@Injectable()
export default class ArticleTagService {
  constructor(
    @Inject(ARTICLE_TAG_REPOSITORY) private readonly articleTagRepository: IArticleTagRepository,
    private readonly tagService: TagService,
  ) {}

  async createTags(article: Article, tagNames: string[], tx: TX): Promise<void> {
    const existTags = await this.tagService.findManyByNames(tagNames);
    const createdTags = await this.tagService.createMany(getNewTags(existTags, tagNames), tx);

    const tags = [...existTags, ...createdTags].map((tag) =>
      new ArticleTag.builder().setArticle(article).setTag(tag).build(),
    );
    await this.articleTagRepository.createMany(article, tags, tx);
  }

  async deleteByArticleId(articleId: string, tx: TX): Promise<void> {
    await this.articleTagRepository.deleteByArticleId(articleId, tx);
  }
}
