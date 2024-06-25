import { userRoles as PrismaUserRoles } from '@prisma/client';
import { userRoles } from '../../../src/modules/user/domain/models/user-role.model';

const userRoleSeed: Pick<PrismaUserRoles, 'name' | 'id'>[] = [
  {
    id: userRoles.normal.id,
    name: userRoles.normal.name,
  },
  {
    id: userRoles.admin.id,
    name: userRoles.admin.name,
  },
];

export default userRoleSeed;
