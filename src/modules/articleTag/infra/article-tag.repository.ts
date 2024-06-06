import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { IArticleTagRepository } from '../repository/article-tag-repo.inteface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Article from '../../article/domain/entities/article.entity';
import ArticleTag from '../domain/entities/article-tag.entity';
import { TX } from '../../../@types/prisma/prisma.type';

@Injectable()
export default class ArticleTagRepository implements IArticleTagRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async createMany(article: Article, articleTags: ArticleTag[]): Promise<void> {
    this.prisma.client.articleTags.createMany({
      data: articleTags.map((articleTag) => ({
        articleId: article.id.toString(),
        tagId: articleTag.tag.id,
      })),
    });
  }

  async deleteByArticleId(articleId: string, tx: TX = this.prisma.client): Promise<void> {
    await tx.articleTags.deleteMany({ where: { articleId } });
  }
}
