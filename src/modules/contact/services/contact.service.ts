import { Injectable } from '@nestjs/common';
import { CreateContactDto } from '../dto/internal/create-contact.dto';
import CreateContactUseCase from '../use-cases/create-contact.use-case';

@Injectable()
export default class ContactService {
  constructor(private readonly createContactUseCase: CreateContactUseCase) {}

  async createContact(dto: CreateContactDto) {
    return this.createContactUseCase.execute(dto);
  }
}
