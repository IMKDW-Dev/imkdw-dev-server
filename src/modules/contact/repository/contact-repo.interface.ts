import Contact from '../domain/models/contact.model';

export const CONTACT_REPOTIROY = Symbol('CONTACT_REPOTIROY');
export interface IContactRepository {
  save(contact: Contact): Promise<Contact>;
}
