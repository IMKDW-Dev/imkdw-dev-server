import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { articles as PrismaArticle } from '@prisma/client';

import { IArticleStatsRepository } from '../repository/article-stats/article-stats-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import ArticleStats from '../domain/entities/article-stats.entity';

@Injectable()
export default class ArticleStatsRepository implements IArticleStatsRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findStats(): Promise<ArticleStats> {
    const articles = await this.prisma.client.articles.findMany();
    const commentCount = await this.prisma.client.articleComments.count();

    return this.toEntity(articles, commentCount);
  }

  private toEntity(articles: PrismaArticle[], commentCount: number): ArticleStats {
    return ArticleStats.create({
      totalArticles: articles.length,
      totalComments: commentCount,
      totalViews: articles.reduce((acc, article) => acc + article.viewCount, 0),
    });
  }
}
