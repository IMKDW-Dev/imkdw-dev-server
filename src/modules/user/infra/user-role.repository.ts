import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { IUserRoleRepository } from '../repository/role/user-role-repo.interface';
import UserRole from '../domain/entities/user-role.entity';
import { UserRoleQueryFilter } from '../repository/role/user-role-query.filter';
import { PRISMA_SERVICE } from '../../../infra/database/prisma';

@Injectable()
export default class UserRoleRepository implements IUserRoleRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: PrismaService) {}

  async findOne(where: UserRoleQueryFilter): Promise<UserRole | null> {
    const row = await this.prisma.userRoles.findFirst({ where });

    return row ? new UserRole(row.id, row.name) : null;
  }
}
