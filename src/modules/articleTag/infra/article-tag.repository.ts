import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { IArticleTagRepository } from '../repository/article-tag-repo.inteface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { TX } from '../../../@types/prisma/prisma.type';
import ArticleTag from '../domain/models/article-tag.model';
import Article from '../../article/domain/models/article.model';

@Injectable()
export default class ArticleTagRepository implements IArticleTagRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async createMany(article: Article, articleTags: ArticleTag[], tx: TX = this.prisma.client): Promise<void> {
    await tx.articleTags.createMany({
      data: articleTags.map((articleTag) => ({
        articleId: article.getId(),
        tagId: articleTag.getTagId(),
      })),
    });
  }

  async deleteByArticleId(articleId: string, tx: TX = this.prisma.client): Promise<void> {
    await tx.articleTags.deleteMany({ where: { articleId } });
  }
}
