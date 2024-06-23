import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { contacts } from '@prisma/client';

import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { IContactRepository } from '../repository/contact-repo.interface';
import Contact from '../domain/entities/contact.entity';

@Injectable()
export default class ContactRepository implements IContactRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async save(contact: Contact): Promise<Contact> {
    const row = await this.prisma.client.contacts.create({ data: contact });
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
