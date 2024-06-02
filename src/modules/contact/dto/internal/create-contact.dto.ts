import Contact from '../../domain/entities/contact.entity';

export interface CreateContactDto extends Pick<Contact, 'name' | 'email' | 'subject' | 'message'> {}
