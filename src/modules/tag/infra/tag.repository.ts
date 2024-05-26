import { Inject, Injectable } from '@nestjs/common';
import { tags as prismaTags } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import { ITagRepository } from '../repository/tag-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Tag, { TagBuilder } from '../domain/entities/tag.entity';

@Injectable()
export default class TagRepository implements ITagRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findManyByNames(names: string[]): Promise<Tag[]> {
    const rows = await this.prisma.client.tags.findMany({
      where: { name: { in: names } },
    });

    return rows.map(this.toEntity);
  }

  async createMany(tags: Tag[]): Promise<Tag[]> {
    const tagsData = tags.map((tag) => ({ name: tag.getName() }));
    await this.prisma.client.tags.createMany({ data: tagsData });

    const createdRows = await this.prisma.client.tags.findMany({
      where: { name: { in: tags.map((tag) => tag.getName()) } },
    });
    return createdRows.map(this.toEntity);
  }

  private toEntity(row: prismaTags): Tag {
    return new TagBuilder().setId(row.id).setName(row.name).build();
  }
}
