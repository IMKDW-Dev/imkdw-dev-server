import { Injectable } from '@nestjs/common';
import { categories } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { ICategoryRepository } from '../repository/category-repo.interface';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import { QueryOption } from '../../../common/interfaces/common-query.filter';
import { CategoryQueryOption } from '../repository/category-query.option';
import Category from '../domain/models/category.model';

@Injectable()
export default class CategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async findOne(where: CategoryQueryFilter): Promise<Category | null> {
    const row = await this.prisma.tx.categories.findFirst({ where });
    return row ? this.toEntity(row) : null;
  }

  async findNextSort(): Promise<number> {
    const maxSort = await this.prisma.tx.categories.aggregate({
      _max: {
        sort: true,
      },
    });

    return maxSort._max.sort ? maxSort._max.sort + 1 : 1;
  }

  async findAll(option: CategoryQueryOption): Promise<Category[]> {
    const rows = await this.prisma.tx.categories.findMany({
      ...(option?.limit && { take: option.limit }),
      orderBy: { sort: 'asc' },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(category: Category): Promise<Category> {
    const row = await this.prisma.tx.categories.create({
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
    const rows = await this.prisma.tx.categories.findMany({
      where: filter,
      select: { name: true },
    });

    return rows.map((row) => row.name);
  }

  async findMany(filter: CategoryQueryFilter, option?: QueryOption): Promise<Category[]> {
    const rows = await this.prisma.tx.categories.findMany({
      where: filter,
      ...(option?.limit && { take: option.limit }),
      orderBy: { sort: 'asc' },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async update(category: Category): Promise<Category> {
    const updatedCategory = await this.prisma.tx.categories.update({
      where: { id: category.getId() },
      data: {
        name: category.getName(),
        desc: category.getDesc(),
        image: category.getImage(),
        sort: category.getSort(),
        articleCount: category.getArticleCount(),
      },
    });

    return this.toEntity(updatedCategory);
  }

  async updateSort(category: Category, newSort: number): Promise<Category> {
    const oldSort = category.getSort();

    if (newSort < oldSort) {
      await this.prisma.tx.categories.updateMany({
        where: { sort: { gte: newSort, lt: oldSort } },
        data: { sort: { increment: 1 } },
      });
    } else {
      await this.prisma.tx.categories.updateMany({
        where: { sort: { gt: oldSort, lte: newSort } },
        data: { sort: { decrement: 1 } },
      });
    }

    const updaedCategory = await this.prisma.tx.categories.update({
      where: { id: category.getId() },
      data: { sort: newSort },
    });

    return this.toEntity(updaedCategory);
  }

  async delete(category: Category): Promise<void> {
    await this.prisma.tx.categories.delete({ where: { id: category.getId() } });
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
