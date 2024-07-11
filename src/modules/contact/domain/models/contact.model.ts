export default class Contact {
  private constructor(id: number, name: string, email: string, subject: string, message: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.subject = subject;
    this.message = message;
  }

  private id: number;
  private name: string;
  private email: string;
  private subject: string;
  private message: string;

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getSubject(): string {
    return this.subject;
  }

  getMessage(): string {
    return this.message;
  }

  static builder = class {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;

    setId(id: number): this {
      this.id = id;
      return this;
    }

    setName(name: string): this {
      this.name = name;
      return this;
    }

    setEmail(email: string): this {
      this.email = email;
      return this;
    }

    setSubject(subject: string): this {
      this.subject = subject;
      return this;
    }

    setMessage(message: string): this {
      this.message = message;
      return this;
    }

    build(): Contact {
      return new Contact(this.id, this.name, this.email, this.subject, this.message);
    }
  };
}
