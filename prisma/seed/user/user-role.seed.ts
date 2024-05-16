import { userRoles } from '@prisma/client';
import UserRoles from '../../../src/modules/user/enums/user-role.enum';

const userRoleSeed: Pick<userRoles, 'name'>[] = [
  {
    name: UserRoles.NORMAL,
  },
  {
    name: UserRoles.ADMIN,
  },
];

export default userRoleSeed;
