import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma, articles } from '@prisma/client';

import { IArticleRepository } from '../repository/article-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Article from '../domain/entities/article.entity';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';

type IArticle = Prisma.articlesGetPayload<{
  include: {
    articleTag: {
      include: {
        tags: true;
      };
    };
    articleComment?: {
      include: {
        user: true;
        replies: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

type IArticleListItem = Prisma.articlesGetPayload<{
  include: {
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
    const row: IArticle = await this.prisma.client.articles.findFirst({
      where: query,
      include: {
        articleTag: {
          include: {
            tags: true,
          },
        },
        articleComment: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: ArticleQueryFilter): Promise<Article[]> {
    const rows: IArticleListItem[] = await this.prisma.client.articles.findMany({
      where: { ...query },
      include: {
        articleTag: {
          include: {
            tags: true,
          },
        },
      },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(article: Article): Promise<Article> {
    const row: IArticleListItem = await this.prisma.client.articles.create({
      include: {
        articleTag: {
          include: {
            tags: true,
          },
        },
      },
      data: {
        id: article.id.toString(),
        title: article.title,
        content: article.content,
        thumbnail: article.thumbnail,
        categoryId: article.category.id,
        visible: article.visible,
      },
    });

    return this.toEntity(row);
  }

  async update(article: Article, data: UpdateArticleDto): Promise<Article> {
    const row = await this.prisma.client.articles.update({
      where: { id: article.id.toString() },
      data: {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
        visible: data.visible,
        viewCount: data.viewCount,
        commentCount: data.commentCount,
      },
    });

    return this.toEntity(row);
  }

  private toEntity(row: IArticle | IArticleListItem | articles): Article {}
}
