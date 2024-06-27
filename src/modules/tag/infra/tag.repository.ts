import { Injectable } from '@nestjs/common';
import { tags as prismaTags } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { ITagRepository } from '../repository/tag-repo.interface';
import Tag from '../domain/models/tag.model';

@Injectable()
export default class TagRepository implements ITagRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async findManyByNames(names: string[]): Promise<Tag[]> {
    const rows = await this.prisma.tx.tags.findMany({
      where: { name: { in: names } },
    });

    return rows.map(this.toEntity);
  }

  async createMany(tags: Tag[]): Promise<Tag[]> {
    const tagsData = tags.map((tag) => ({ name: tag.toString() }));
    await this.prisma.tx.tags.createMany({ data: tagsData });

    const createdRows = await this.prisma.tx.tags.findMany({
      where: { name: { in: tags.map((tag) => tag.toString()) } },
    });
    return createdRows.map(this.toEntity);
  }

  private toEntity(row: prismaTags): Tag {
    return new Tag.builder().setId(row.id).setName(row.name).build();
  }
}
