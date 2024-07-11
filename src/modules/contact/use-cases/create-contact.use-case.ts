import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../common/interfaces/use-case.interface';
import { CreateContactDto } from '../dto/internal/create-contact.dto';
import Contact from '../domain/models/contact.model';
import { CONTACT_REPOTIROY, IContactRepository } from '../repository/contact-repo.interface';

@Injectable()
export default class CreateContactUseCase implements UseCase<CreateContactDto, Contact> {
  constructor(@Inject(CONTACT_REPOTIROY) private readonly contactRepository: IContactRepository) {}

  async execute(dto: CreateContactDto): Promise<Contact> {
    const contact = new Contact.builder()
      .setName(dto.name)
      .setEmail(dto.email)
      .setSubject(dto.subject)
      .setMessage(dto.message)
      .build();

    return this.contactRepository.save(contact);
  }
}
