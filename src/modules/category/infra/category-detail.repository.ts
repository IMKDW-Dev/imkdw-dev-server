import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import { ICategoryDetailRepository } from '../repository/category-detail-repo.interface';
import CategoryDetailDto, { CategoryDetailBuilder } from '../dto/category-detail.dto';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { QueryOption } from '../../../common/interfaces/common-query.filter';

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

  async findMany(filter: CategoryQueryFilter, option?: QueryOption): Promise<CategoryDetailDto[]> {
    const rows = await this.prisma.client.category.findMany({
      where: filter,
      include: {
        articles: true,
      },
      orderBy: { sort: 'asc' },
      ...(option?.limit && { take: option.limit }),
    });
    return rows.map((row) => this.toDto(row));
  }

  private toDto(row: FindOneResult): CategoryDetailDto {
    return new CategoryDetailBuilder()
      .setId(row.id)
      .setName(row.name)
      .setDesc(row.desc)
      .setImage(row.image)
      .setSort(row.sort)
      .setArticleCount(row.articles.length)
      .build();
  }
}
