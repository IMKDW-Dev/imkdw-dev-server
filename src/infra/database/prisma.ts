/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

export const PRISMA_SERVICE = 'PRISMA_SERVICE';
const prismaClient = new PrismaClient();

export const extendedPrismaClient = (cls: ClsService) =>
  prismaClient.$extends({
    query: {
      $allModels: {
        async findUnique({ model, args }) {
          return (prismaClient as any)[model].findUnique({
            ...args,
            where: { ...args.where, deleteAt: null },
          });
        },
        async findFirst({ model, args }) {
          return (prismaClient as any)[model].findFirst({
            ...args,
            where: { ...args.where, deleteAt: null },
          });
        },
        async findMany({ model, args }) {
          return (prismaClient as any)[model].findMany({
            ...args,
            where: { ...args.where, deleteAt: null },
          });
        },
        async create({ model, args }) {
          const userId = cls.get('userId');
          return (prismaClient as any)[model].create({
            ...args,
            data: { ...args.data, createUser: userId, updateUser: userId },
          });
        },
        async createMany({ model, args }) {
          const userId = cls.get('userId');
          if (Array.isArray(args.data)) {
            return (prismaClient as any)[model].createMany({
              ...args,
              data: args.data.map((data) => ({
                ...data,
                createUser: userId,
                updateUser: userId,
              })),
            });
          }

          return (prismaClient as any)[model].createMany({
            ...args,
            data: { ...args.data, createUser: userId, updateUser: userId },
          });
        },
        async update({ model, args }) {
          const userId = cls.get('userId');
          return (prismaClient as any)[model].update({
            ...args,
            data: { ...args.data, updateUser: userId },
          });
        },
        async updateMany({ model, args }) {
          const userId = cls.get('userId');
          return (prismaClient as any)[model].updateMany({
            ...args,
            data: { ...args.data, updateUser: userId },
          });
        },
        async delete({ model, args }) {
          const userId = cls.get('userId');
          return (prismaClient as any)[model].update({
            ...args,
            data: { deleteAt: new Date(), deleteUser: userId },
          });
        },
        async deleteMany({ model, args }) {
          const userId = cls.get('userId');
          return (prismaClient as any)[model].updateMany({
            ...args,
            data: { deleteAt: new Date(), deleteUser: userId },
          });
        },
      },
    },
  });

export interface ExtendedPrismaClient extends PrismaClient {}
