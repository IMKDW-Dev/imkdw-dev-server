import { DEFAULT_PROFILE } from '../../constants/user.constant';

export default class Profile {
  private value: string;

  constructor(value?: string) {
    this.value = value || this.generateDefaultProfile();
  }

  toString() {
    return this.value;
  }

  private generateDefaultProfile() {
    return DEFAULT_PROFILE;
  }
}
