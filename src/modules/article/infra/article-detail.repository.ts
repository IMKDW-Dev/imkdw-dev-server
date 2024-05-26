import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { IArticleDetailRepository } from '../repository/article-detail-repo.interface';
import ArticleDetailDto, { ArticleDetailDtoBuilder } from '../dto/article-detail.dto';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import { Prisma } from '@prisma/client';

type FindOneResult = Prisma.articlesGetPayload<{
  include: {
    articleTag: {
      include: {
        tags: true;
      };
    };
    articleComment: {
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
@Injectable()
export default class ArticleDetailRepository implements IArticleDetailRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(filter: ArticleQueryFilter): Promise<ArticleDetailDto | null> {
    const row = await this.prisma.client.articles.findFirst({
      where: filter,
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

    return row ? this.toDto(row) : null;
  }

  private toDto(row: FindOneResult): ArticleDetailDto {
    return new ArticleDetailDtoBuilder()
      .setId(row.id)
      .setTitle(row.title)
      .setContent(row.content)
      .setViewCount(row.viewCount)
      .setCreatedAt(row.createdAt)
      .setTags(row.articleTag.map((tag) => tag.tags))
      .build();
  }
}
