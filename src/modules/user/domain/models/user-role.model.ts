export const userRoles = {
  normal: { id: 1, name: 'normal' },
  admin: { id: 2, name: 'admin' },
} as const;

export default class UserRole {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  private id: number;
  private name: string;

  getId(): number {
    return this.id;
  }

  toString() {
    return this.name;
  }

  static NORMAL = new UserRole(userRoles.normal.id, userRoles.normal.name);
  static ADMIN = new UserRole(userRoles.admin.id, userRoles.admin.name);
}
