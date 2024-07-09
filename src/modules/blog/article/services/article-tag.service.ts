import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_TAG_REPOSITORY, IArticleTagRepository } from '../repository/article-tag-repo.inteface';
import TagService from '../../tag/services/tag.service';
import ArticleTag from '../domain/models/article-tag.model';
import Article from '../domain/models/article.model';
import { getNewTags } from '../functions/tag.function';

@Injectable()
export default class ArticleTagService {
  constructor(
    @Inject(ARTICLE_TAG_REPOSITORY) private readonly articleTagRepository: IArticleTagRepository,
    private readonly tagService: TagService,
  ) {}

  async createTags(article: Article, tagNames: string[]): Promise<void> {
    const existTags = await this.tagService.findByNames(tagNames);
    const createdTags = await this.tagService.createTags({ tagNames: getNewTags(existTags, tagNames) });

    const tags = [...existTags, ...createdTags].map((tag) =>
      new ArticleTag.builder().setArticle(article).setTag(tag).build(),
    );
    await this.articleTagRepository.createMany(article, tags);
  }

  async deleteByArticleId(articleId: string): Promise<void> {
    await this.articleTagRepository.deleteByArticleId(articleId);
  }
}
