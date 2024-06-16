import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { ICategoryRepository } from '../repository/category-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Category from '../domain/entities/category.entity';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import { QueryOption } from '../../../common/interfaces/common-query.filter';

type ICategory = Prisma.categoriesGetPayload<{
  include: {
    articles: true;
  };
}>;

const categoryInclude = {
  articles: true,
};

@Injectable()
export default class CategoryRepository implements ICategoryRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(where: CategoryQueryFilter): Promise<Category | null> {
    const row: ICategory = await this.prisma.client.categories.findFirst({ where, include: categoryInclude });
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

  async save(category: Category): Promise<Category> {
    const row: ICategory = await this.prisma.client.categories.create({
      data: {
        name: category.name,
        sort: category.sort,
        desc: category.desc,
        image: category.image,
      },
      include: categoryInclude,
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
    const rows: ICategory[] = await this.prisma.client.categories.findMany({
      where: {
        ...(filter?.id && { id: filter.id }),
        ...(filter?.name && { name: filter.name }),
      },
      ...(option?.limit && { take: option.limit }),
      orderBy: { sort: 'asc' },
      include: categoryInclude,
    });

    return rows.map((row) => this.toEntity(row));
  }

  async update(category: Category, data: UpdateCategoryDto): Promise<Category> {
    const updatedCategory: ICategory = await this.prisma.client.categories.update({
      where: { id: category.id },
      include: categoryInclude,
      data,
    });

    return this.toEntity(updatedCategory);
  }

  async updateSort(categoryId: number, newSort: number) {
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

    await this.prisma.client.categories.update({
      where: { id: categoryId },
      data: { sort: newSort },
    });
  }

  async delete(category: Category): Promise<void> {
    await this.prisma.client.categories.delete({ where: { id: category.id } });
  }

  private toEntity(category: ICategory) {
    return Category.create({
      id: category.id,
      name: category.name,
      image: category.image,
      desc: category.desc,
      sort: category.sort,
      articleCount: category.articles.length,
    });
  }
}
