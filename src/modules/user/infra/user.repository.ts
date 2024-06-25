import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import User from '../domain/models/user.model';
import { UserQueryFilter } from '../repository/user/user-query.filter';
import { IUserRepository } from '../repository/user/user-repo.interface';
import UserRole from '../domain/models/user-role.model';
import UserOAuthProvider from '../domain/models/user-oauth-provider.model';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';

type IUser = Prisma.usersGetPayload<{
  include: {
    role: true;
    oAuthProvider: true;
  };
}>;

const userInclude = {
  role: true,
  oAuthProvider: true,
} as const;

@Injectable()
export default class UserRepository implements IUserRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(where: UserQueryFilter): Promise<User | null> {
    const row: IUser = await this.prisma.client.users.findFirst({
      where,
      include: userInclude,
    });

    if (!row) {
      return null;
    }

    return this.toEntity(row);
  }

  async save(user: User): Promise<User> {
    const row: IUser = await this.prisma.client.users.create({
      data: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profile: user.profile,
        roleId: user.role.id,
        oAuthProviderId: user.oAuthProvider.id,
      },
      include: userInclude,
    });

    return this.toEntity(row);
  }

  async update(userId: string, user: User): Promise<User> {
    const updatedRow: IUser = await this.prisma.client.users.update({
      where: { id: userId },
      data: {
        nickname: user.nickname,
        profile: user.profile,
      },
      include: userInclude,
    });

    return this.toEntity(updatedRow);
  }

  async count(): Promise<number> {
    return this.prisma.client.users.count();
  }

  private toEntity(user: IUser): User {
    const role = UserRole.create({ id: user.role.id, name: user.role.name });
    const oAuthProvider = UserOAuthProvider.create({ id: user.oAuthProvider.id, provider: user.oAuthProvider.name });

    return User.create({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profile: user.profile,
      role,
      oAuthProvider,
    });
  }
}
