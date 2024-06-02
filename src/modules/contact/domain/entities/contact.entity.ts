interface Props {
  id?: number;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
export default class Contact {
  constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.subject = props.subject;
    this.message = props.message;
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
