import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { IUserRoleRepository } from '../repository/role/user-role-repo.interface';
import UserRole from '../domain/entities/user-role.entity';
import { UserRoleQueryFilter } from '../repository/role/user-role-query.filter';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';

@Injectable()
export default class UserRoleRepository implements IUserRoleRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(where: UserRoleQueryFilter): Promise<UserRole | null> {
    const row = await this.prisma.client.userRoles.findFirst({ where });
    return row ? UserRole.create({ id: row.id, name: row.name }) : null;
  }
}
