export default class UserRole {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  private id: number;
  private name: string;

  toString() {
    return this.name;
  }

  static NORMAL = new UserRole(1, 'normal');
  static ADMIN = new UserRole(2, 'admin');
}
