import { Inject, Injectable } from '@nestjs/common';
import { tags as prismaTags } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import { ITagRepository } from '../repository/tag-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { TX } from '../../../@types/prisma/prisma.type';
import Tag from '../domain/models/tag.model';

@Injectable()
export default class TagRepository implements ITagRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findManyByNames(names: string[]): Promise<Tag[]> {
    const rows = await this.prisma.client.tags.findMany({
      where: { name: { in: names } },
    });

    return rows.map(this.toEntity);
  }

  async createMany(tags: Tag[], tx: TX = this.prisma.client): Promise<Tag[]> {
    const tagsData = tags.map((tag) => ({ name: tag.getName() }));
    await tx.tags.createMany({ data: tagsData });

    const createdRows = await tx.tags.findMany({
      where: { name: { in: tags.map((tag) => tag.getName()) } },
    });
    return createdRows.map(this.toEntity);
  }

  private toEntity(row: prismaTags): Tag {
    return new Tag.builder().setId(row.id).setName(row.name).build();
  }
}
