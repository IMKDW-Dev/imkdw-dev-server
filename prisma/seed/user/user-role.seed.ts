import { userRoles } from '@prisma/client';
import UserRoles from '../../../src/modules/user/enums/user-role.enum';

const userRoleSeed: Pick<userRoles, 'name' | 'id'>[] = [
  {
    id: 1,
    name: UserRoles.NORMAL,
  },
  {
    id: 2,
    name: UserRoles.ADMIN,
  },
];

export default userRoleSeed;
