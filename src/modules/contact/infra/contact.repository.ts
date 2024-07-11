import { Injectable } from '@nestjs/common';
import { contacts } from '@prisma/client';

import { IContactRepository } from '../repository/contact-repo.interface';
import Contact from '../domain/models/contact.model';
import PrismaService from '../../../infra/database/prisma.service';

@Injectable()
export default class ContactRepository implements IContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(contact: Contact): Promise<Contact> {
    const row = await this.prisma.contacts.create({
      data: {
        name: contact.getName(),
        email: contact.getEmail(),
        subject: contact.getSubject(),
        message: contact.getMessage(),
      },
    });
    return this.toModel(row);
  }

  private toModel(row: contacts) {
    return new Contact.builder()
      .setId(row.id)
      .setName(row.name)
      .setEmail(row.email)
      .setSubject(row.subject)
      .setMessage(row.message)
      .build();
  }
}
