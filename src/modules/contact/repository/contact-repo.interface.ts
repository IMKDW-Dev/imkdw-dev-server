import Contact from '../domain/entities/contact.entity';

export const CONTACT_REPOTIROY = Symbol('CONTACT_REPOTIROY');
export interface IContactRepository {
  save(contact: Contact): Promise<Contact>;
}
