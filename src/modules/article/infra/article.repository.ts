import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { IArticleRepository } from '../repository/article-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Article, { ArticleBuilder } from '../domain/entities/article.entity';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import { CategoryBuilder } from '../../category/domain/entities/category.entity';

type FindOneResult = Prisma.articlesGetPayload<{
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
export default class ArticleRepository implements IArticleRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(query: ArticleQueryFilter): Promise<Article> {
    const row: FindOneResult = await this.prisma.client.articles.findFirst({
      where: { ...query },
      include: { category: true, articleTag: { include: { tags: true } } },
    });

    return row ? this.toEntity(row) : null;
  }

  async save(article: Article): Promise<Article> {
    const row = await this.prisma.client.articles.create({
      data: {
        id: article.getId(),
        title: article.getTitle(),
        content: article.getContent(),
        thumbnail: article.getThumbnail(),
        categoryId: article.getCategory().getId(),
        visible: article.getVisible(),
      },
      include: { category: true, articleTag: { include: { tags: true } } },
    });

    return this.toEntity(row);
  }

  private toEntity(row: FindOneResult): Article {
    const category = new CategoryBuilder()
      .setId(row.category.id)
      .setName(row.category.name)
      .setDesc(row.category.desc)
      .setImage(row.category.image)
      .setSort(row.category.sort)
      .build();

    return new ArticleBuilder()
      .setId(row.id)
      .setTitle(row.title)
      .setContent(row.content)
      .setCategory(category)
      .setViewCount(row.viewCount)
      .setThumbnail(row.thumbnail)
      .setCreatedAt(row.createAt)
      .build();
  }
}
