interface Props extends Partial<Contact> {}

export default class Contact {
  constructor(props: Props) {
    Object.assign(this, props);
  }

  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;

  static create(props: Props) {
    return new Contact(props);
  }
}
