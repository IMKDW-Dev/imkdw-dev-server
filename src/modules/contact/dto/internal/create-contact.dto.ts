import Contact from '../../domain/models/contact.model';

export interface CreateContactDto extends Pick<Contact, 'name' | 'email' | 'subject' | 'message'> {}
