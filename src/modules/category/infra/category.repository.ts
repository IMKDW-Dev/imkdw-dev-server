import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { categories } from '@prisma/client';

import { ICategoryRepository } from '../repository/category-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import { QueryOption } from '../../../common/interfaces/common-query.filter';
import { TX } from '../../../@types/prisma/prisma.type';
import { CategoryQueryOption } from '../repository/category-query.option';
import Category from '../domain/models/category.model';

@Injectable()
export default class CategoryRepository implements ICategoryRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(where: CategoryQueryFilter): Promise<Category | null> {
    const row = await this.prisma.client.categories.findFirst({ where });
    return row ? this.toEntity(row) : null;
  }

  async findNextSort(): Promise<number> {
    const maxSort = await this.prisma.client.categories.aggregate({
      _max: {
        sort: true,
      },
    });

    return maxSort._max.sort ? maxSort._max.sort + 1 : 1;
  }

  async findAll(option: CategoryQueryOption): Promise<Category[]> {
    const rows = await this.prisma.client.categories.findMany({
      ...(option?.limit && { take: option.limit }),
      orderBy: { sort: 'asc' },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(category: Category, tx: TX = this.prisma.client): Promise<Category> {
    const row = await tx.categories.create({
      data: {
        name: category.getName(),
        sort: category.getSort(),
        desc: category.getDesc(),
        image: category.getImage(),
      },
    });

    return this.toEntity(row);
  }

  async findNames(filter: CategoryQueryFilter): Promise<string[]> {
    const rows = await this.prisma.client.categories.findMany({
      where: {
        ...(filter?.id && { id: filter.id }),
        ...(filter?.name && { name: { contains: filter.name } }),
      },
      select: { name: true },
    });

    return rows.map((row) => row.name);
  }

  async findMany(filter: CategoryQueryFilter, option?: QueryOption): Promise<Category[]> {
    const rows = await this.prisma.client.categories.findMany({
      where: {
        ...(filter?.id && { id: filter.id }),
        ...(filter?.name && { name: filter.name }),
      },
      ...(option?.limit && { take: option.limit }),
      orderBy: { sort: 'asc' },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async update(category: Category, tx: TX = this.prisma.client): Promise<Category> {
    const updatedCategory = await tx.categories.update({
      where: { id: category.getId() },
      data: {
        name: category.getName(),
        desc: category.getDesc(),
        image: category.getImage(),
        sort: category.getSort(),
      },
    });

    return this.toEntity(updatedCategory);
  }

  async updateSort(categoryId: number, newSort: number): Promise<Category> {
    const category = await this.prisma.client.categories.findFirst({ where: { id: categoryId } });
    const oldSort = category.sort;

    if (newSort < oldSort) {
      await this.prisma.client.categories.updateMany({
        where: { sort: { gte: newSort, lt: oldSort } },
        data: { sort: { increment: 1 } },
      });
    } else {
      await this.prisma.client.categories.updateMany({
        where: { sort: { gt: oldSort, lte: newSort } },
        data: { sort: { decrement: 1 } },
      });
    }

    const updaedCategory = await this.prisma.client.categories.update({
      where: { id: categoryId },
      data: { sort: newSort },
    });

    return this.toEntity(updaedCategory);
  }

  async delete(category: Category): Promise<void> {
    await this.prisma.client.categories.delete({ where: { id: category.getId() } });
  }

  private toEntity(category: categories) {
    return new Category.builder()
      .setId(category.id)
      .setName(category.name)
      .setDesc(category.desc)
      .setImage(category.image)
      .setSort(category.sort)
      .setArticleCount(category.articleCount)
      .build();
  }
}
