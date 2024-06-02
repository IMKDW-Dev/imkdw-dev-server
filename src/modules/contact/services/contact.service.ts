import { Inject, Injectable } from '@nestjs/common';
import { CONTACT_REPOTIROY, IContactRepository } from '../repository/contact-repo.interface';
import { CreateContactDto } from '../dto/internal/create-contact.dto';
import Contact from '../domain/entities/contact.entity';

@Injectable()
export default class ContactService {
  constructor(@Inject(CONTACT_REPOTIROY) private readonly contactRepository: IContactRepository) {}

  async createContact(dto: CreateContactDto) {
    const contact = Contact.create(dto);
    return this.contactRepository.save(contact);
  }
}
