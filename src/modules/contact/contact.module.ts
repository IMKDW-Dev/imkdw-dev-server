import { Module } from '@nestjs/common';
import ContactController from './controllers/contact.controller';
import ContactService from './services/contact.service';
import { CONTACT_REPOTIROY } from './repository/contact-repo.interface';
import ContactRepository from './infra/contact.repository';
import CreateContactUseCase from './use-cases/create-contact.use-case';

@Module({
  controllers: [ContactController],
  providers: [
    ContactService,
    CreateContactUseCase,
    {
      provide: CONTACT_REPOTIROY,
      useClass: ContactRepository,
    },
  ],
})
export default class ContactModule {}
