import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { IArticleTagRepository } from '../repository/article-tag-repo.inteface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Article from '../../article/domain/entities/article.entity';
import ArticleTag from '../domain/entities/article-tag.entity';

@Injectable()
export default class ArticleTagRepository implements IArticleTagRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async createMany(article: Article, tags: ArticleTag[]): Promise<void> {
    await this.prisma.client.articleTag.createMany({
      data: tags.map((tag) => ({
        articleId: article.getId(),
        tagId: tag.getTag().getId(),
      })),
    });
  }
}
