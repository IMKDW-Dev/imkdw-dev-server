import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import { ICategoryDetailRepository } from '../repository/category-detail-repo.interface';
import CategoryDetailDto, { CategoryDetailBuilder } from '../dto/category-detail.dto';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';

type FindOneResult = Prisma.categoryGetPayload<{
  include: {
    articles: true;
  };
}>;

@Injectable()
export default class CategoryDetailRepository implements ICategoryDetailRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(filter: CategoryQueryFilter): Promise<CategoryDetailDto | null> {
    const row = await this.prisma.client.category.findFirst({
      where: filter,
      include: {
        articles: true,
      },
    });
    return row ? this.toDto(row) : null;
  }

  private toDto(row: FindOneResult): CategoryDetailDto {
    return new CategoryDetailBuilder()
      .setId(row.id)
      .setName(row.name)
      .setDesc(row.desc)
      .setImage(row.image)
      .setArticleCount(row.articles.length)
      .build();
  }
}
