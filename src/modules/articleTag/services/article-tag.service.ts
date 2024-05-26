import { Inject, Injectable } from '@nestjs/common';
import { ARTICE_TAG_REPOSITORY, IArticleTagRepository } from '../repository/article-tag-repo.inteface';
import TagQueryService from '../../tag/services/tag-query.service';
import TagService from '../../tag/services/tag.service';
import Article from '../../article/domain/entities/article.entity';
import { ArticleTagBuilder } from '../domain/entities/article-tag.entity';

@Injectable()
export default class ArticleTagService {
  constructor(
    @Inject(ARTICE_TAG_REPOSITORY) private readonly articleTagRepository: IArticleTagRepository,
    private readonly tagQueryService: TagQueryService,
    private readonly tagService: TagService,
  ) {}

  async createTags(article: Article, tagNames: string[]) {
    const tagsByName = await this.tagQueryService.findManyByNames(tagNames);

    const existingTagNames = tagsByName.map((tag) => tag.getName());
    const newTagNames = tagNames.filter((name) => !existingTagNames.includes(name));

    const newTags = await this.tagService.createMany(newTagNames);
    const tags = [...tagsByName, ...newTags].map((tag) =>
      new ArticleTagBuilder().setArticle(article).setTag(tag).build(),
    );
    await this.articleTagRepository.createMany(article, tags);
  }
}
