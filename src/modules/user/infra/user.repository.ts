import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as UserMapper from '../mappers/user.mapper';

import User from '../domain/models/user.model';
import { UserQueryFilter } from '../repository/user/user-query.filter';
import { IUserRepository } from '../repository/user/user-repo.interface';
import PrismaService from '../../../infra/database/prisma.service';

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
  constructor(private readonly prisma: PrismaService) {}

  async findOne(where: UserQueryFilter): Promise<User | null> {
    const row: IUser = await this.prisma.users.findFirst({ where, include: userInclude });
    if (!row) {
      return null;
    }

    return this.toEntity(row);
  }

  async save(user: User): Promise<User> {
    const row: IUser = await this.prisma.users.create({
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

    return this.toEntity(row);
  }

  async update(user: User): Promise<User> {
    const updatedRow: IUser = await this.prisma.users.update({
      where: { id: user.getId() },
      data: {
        nickname: user.getNickname(),
        profile: user.getProfile(),
      },
      include: userInclude,
    });

    return this.toEntity(updatedRow);
  }

  async count(): Promise<number> {
    return this.prisma.users.count();
  }

  private toEntity(user: IUser): User {
    return UserMapper.toModel(user, user.role, user.oAuthProvider);
  }
}
