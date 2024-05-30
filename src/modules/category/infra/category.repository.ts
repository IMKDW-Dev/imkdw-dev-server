import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { category as PrismaCategory } from '@prisma/client';

import { ICategoryRepository } from '../repository/category-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Category, { CategoryBuilder } from '../domain/entities/category.entity';
import { CategoryQueryFilter } from '../repository/category-query.filter';
import { UpdateCategoryDto } from '../dto/internal/update-category.dto';
import { QueryOption } from '../../../common/interfaces/common-query.filter';

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
        desc: category.getDesc(),
        image: category.getImage(),
      },
    });

    return this.toEntity(row);
  }

  async findMany(filter: CategoryQueryFilter, option?: QueryOption): Promise<Category[]> {
    const rows = await this.prisma.client.category.findMany({
      where: {
        ...(filter?.id && { id: filter.id }),
        ...(filter?.name && { name: filter.name }),
      },
      ...(option?.limit && { take: option.limit }),
      orderBy: { sort: 'desc' },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async update(category: Category, data: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.prisma.client.category.update({
      where: { id: category.getId() },
      data,
    });

    return this.toEntity(updatedCategory);
  }

  private toEntity(_category: PrismaCategory) {
    const category = new CategoryBuilder()
      .setId(_category.id)
      .setName(_category.name)
      .setSort(_category.sort)
      .setImage(_category.image)
      .setDesc(_category.desc)
      .build();

    return category;
  }

  async updateSort(categoryId: number, newSort: number) {
    const category = await this.prisma.client.category.findFirst({ where: { id: categoryId } });
    const oldSort = category.sort;

    if (newSort < oldSort) {
      await this.prisma.client.category.updateMany({
        where: { sort: { gte: newSort, lt: oldSort } },
        data: {
          sort: { increment: 1 },
        },
      });
    } else {
      await this.prisma.client.category.updateMany({
        where: { sort: { gt: oldSort, lte: newSort } },
        data: { sort: { decrement: 1 } },
      });
    }

    await this.prisma.client.category.update({
      where: { id: categoryId },
      data: { sort: newSort },
    });
  }

  async delete(category: Category): Promise<void> {
    await this.prisma.client.category.delete({ where: { id: category.getId() } });
  }
}
