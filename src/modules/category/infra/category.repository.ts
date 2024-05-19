import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { category as PrismaCategory } from '@prisma/client';

import { ICategoryRepository } from '../repository/category-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Category, { CategoryBuilder } from '../domain/entities/category.entity';
import { CategoryQueryFilter } from '../repository/category-query.filter';

@Injectable()
export default class CategoryRepository implements ICategoryRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(where: CategoryQueryFilter): Promise<Category | null> {
    const row = await this.prisma.client.category.findFirst({ where });
    return row ? this.toEntity(row) : null;
  }

  async findNextSort(): Promise<number> {
    const maxSort = await this.prisma.client.category.aggregate({
      _max: {
        sort: true,
      },
    });

    return maxSort._max.sort ? maxSort._max.sort + 1 : 1;
  }

  async save(category: Category): Promise<Category> {
    const row = await this.prisma.client.category.create({
      data: {
        name: category.getName(),
        sort: category.getSort(),
      },
    });

    return this.toEntity(row);
  }

  private toEntity(_category: PrismaCategory) {
    const category = new CategoryBuilder().setId(_category.id).setName(_category.name).setSort(_category.sort).build();

    return category;
  }
}
