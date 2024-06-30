import { Injectable } from '@nestjs/common';
import { contacts } from '@prisma/client';

import { IContactRepository } from '../repository/contact-repo.interface';
import Contact from '../domain/entities/contact.entity';
import PrismaService from '../../../infra/database/prisma.service';

@Injectable()
export default class ContactRepository implements IContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(contact: Contact): Promise<Contact> {
    const row = await this.prisma.contacts.create({ data: contact });
    return this.toEntity(row);
  }

  private toEntity(row: contacts) {
    return Contact.create({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
    });
  }
}
