import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import * as UserMapper from '../mappers/user.mapper';
import User from '../domain/models/user.model';
import { IUserRepository, UserQueryFilter } from '../interfaces/user-repo.interface';

export type IUser = Prisma.usersGetPayload<{
  include: {
    role: true;
    oAuthProvider: true;
  };
}>;

export const userInclude = {
  role: true,
  oAuthProvider: true,
} as const;

@Injectable()
export default class UserRepository implements IUserRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async findOne(where: UserQueryFilter): Promise<User | null> {
    const row: IUser = await this.prisma.tx.users.findFirst({
      where: {
        ...(where.id && { id: where.id }),
        ...(where.email && { email: where.email }),
        ...(where.nickname && { nickname: where.nickname }),
      },
      include: userInclude,
    });
    if (!row) {
      return null;
    }

    return this.toModel(row);
  }

  async save(user: User): Promise<User> {
    const row: IUser = await this.prisma.tx.users.create({
      data: {
        id: user.getId(),
        email: user.getEmail(),
        nickname: user.getNickname(),
        profile: user.getProfile(),
        roleId: user.getRoleId(),
        oAuthProviderId: user.getOAuthProviderId(),
      },
      include: userInclude,
    });

    return this.toModel(row);
  }

  async update(user: User): Promise<User> {
    const updatedRow: IUser = await this.prisma.tx.users.update({
      where: { id: user.getId() },
      data: {
        nickname: user.getNickname(),
        profile: user.getProfile(),
      },
      include: userInclude,
    });

    return this.toModel(updatedRow);
  }

  async count(): Promise<number> {
    return this.prisma.tx.users.count();
  }

  private toModel(user: IUser): User {
    return UserMapper.toModel(user, user.role, user.oAuthProvider);
  }
}
