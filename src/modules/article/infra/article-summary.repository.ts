import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { IArticleSummaryRepository } from '../repository/article-summary-repo.interface';
import ArticleSummaryDto, { ArticleSummaryDtoBuilder } from '../dto/article-summary.dto';
import CategorySummaryDto from '../../category/dto/category-summary.dto';
import TagDto from '../../tag/dto/tag.dto';

type QueryResult = Prisma.articlesGetPayload<{
  include: {
    category: true;
    articleTag: {
      include: {
        tags: true;
      };
    };
  };
}>;

@Injectable()
export default class ArticleSummaryRepository implements IArticleSummaryRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findArticlesOrderByViewCount(limit: number): Promise<ArticleSummaryDto[]> {
    const rows = await this.prisma.client.articles.findMany({
      orderBy: { viewCount: 'desc' },
      take: limit,
      include: { category: true, articleTag: { include: { tags: true } } },
    });

    return rows.map(this.toDto);
  }
  async findLatestArticles(limit: number): Promise<ArticleSummaryDto[]> {
    const rows = await this.prisma.client.articles.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { category: true, articleTag: { include: { tags: true } } },
    });

    return rows.map(this.toDto);
  }

  private toDto(row: QueryResult): ArticleSummaryDto {
    const categorySummary = new CategorySummaryDto(row.category.id, row.category.name);
    const tags = row.articleTag.map((articleTag) => new TagDto(articleTag.tags.id, articleTag.tags.name));

    return new ArticleSummaryDtoBuilder()
      .setId(row.id)
      .setThumbnail(row.thumbnail)
      .setTitle(row.title)
      .setContent(row.content)
      .setViewCount(row.viewCount)
      .setCreatedAt(row.createdAt)
      .setCategory(categorySummary)
      .setTags(tags)
      .build();
  }
}
